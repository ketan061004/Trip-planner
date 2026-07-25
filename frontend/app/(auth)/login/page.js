"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import AuthShell from "../../../components/auth/AuthShell";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Please enter your email and password.");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to plan and manage your trips."
      footer={
        <>
          Don’t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert type="error">{error}</Alert>
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
