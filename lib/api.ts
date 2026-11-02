export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/* The JWT comes from our own /api/token route, which first checks the BetterAuth session cookie. */
let cached: { token: string; expires: number } | null = null;
export const clearToken = () => {
  cached = null;
};

async function getToken(force = false) {
  if (!force && cached && cached.expires - Date.now() > 60_000) return cached.token;
  const res = await fetch("/api/token", { cache: "no-store", credentials: "same-origin" });
  if (!res.ok) throw new ApiError("Please log in to continue.", 401);
  const { token } = (await res.json()) as { token: string };
  const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  cached = { token, expires: payload.exp * 1000 };
  return token;
}

type Options = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; auth?: boolean };

export async function api<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const send = async (force: boolean) => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = `Bearer ${await getToken(force)}`;
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  };

  let res: Response;
  try {
    res = await send(false);
    if (res.status === 401 && auth) res = await send(true); // token may have just expired: retry once
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Can't reach the BookNook server. Check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message ?? "Something went wrong. Please try again.", res.status);
  return data as T;
}
