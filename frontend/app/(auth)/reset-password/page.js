"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "../../../components/auth/AuthShell";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { auth } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const { applyToken } = useAuth();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = {};
    if (form.password.length < 8) errs.password = "At least 8 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords don’t match";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await auth.resetPassword({ token, password: form.password });
      // Backend returns a fresh session token — log the user straight in.
      if (res.token && res.user) applyToken(res.token, res.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Alert type="error">
        This reset link is missing its token. Please request a new one from{" "}
        <Link href="/forgot-password" className="font-semibold underline">
          Forgot password
        </Link>
        .
      </Alert>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Alert type="error">{error}</Alert>
      <PasswordInput
        label="New password"
        name="password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        autoComplete="new-password"
      />
      <PasswordInput
        label="Confirm new password"
        name="confirm"
        placeholder="Re-enter your new password"
        value={form.confirm}
        onChange={set("confirm")}
        error={errors.confirm}
        autoComplete="new-password"
      />
      <Button type="submit" size="lg" loading={loading} className="w-full">
        Reset password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you’ll remember."
      footer={
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
