"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
import AuthShell from "../../../components/auth/AuthShell";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "At least 8 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords don’t match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start planning smarter trips in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Alert type="error">{error}</Alert>
        <Input
          label="Full name"
          name="name"
          icon={User}
          placeholder="Jane Traveler"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          name="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm password"
          name="confirm"
          placeholder="Re-enter your password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
