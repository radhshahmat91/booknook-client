import { createAuthClient } from "better-auth/react";
import { clearToken } from "./api";

export const authClient = createAuthClient();
export const { useSession, signIn, signUp } = authClient;

/** True while logging out, so private pages don't redirect to /login instead of Home. */
export const logoutFlag = { active: false };

export async function logout() {
  logoutFlag.active = true;
  clearToken();
  await authClient.signOut();
  setTimeout(() => (logoutFlag.active = false), 2000);
}
