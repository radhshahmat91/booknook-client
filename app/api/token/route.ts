import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

// Exchanges a valid BetterAuth session for a short-lived JWT that the Express API verifies.
export async function GET() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.json({ message: "JWT_SECRET is not configured." }, { status: 500 });

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Not logged in." }, { status: 401 });

  const { id, email, name, image } = session.user;
  const token = await new SignJWT({ email, name, picture: image ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuer("booknook-web")
    .setAudience("booknook-api")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
}
