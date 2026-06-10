"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/credentials";

export interface LoginState {
  error?: string;
  email?: string;
}

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  if (!verifyCredentials(email, password)) {
    return { error: "Invalid email or password.", email };
  }

  await createSession({ userId: "admin", email: email.toLowerCase().trim() });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/taslima");
}
