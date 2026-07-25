"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import AuthShell from "../../../components/auth/AuthShell";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { auth } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevLink("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email");
    setLoading(true);
    try {
      const res = await auth.forgotPassword(email);
      setMessage(res.message || "If that account exists, a reset link has been sent.");
      // Dev mode (no SMTP): backend returns a usable reset link.
      if (res.devResetLink) setDevLink(res.devResetLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we’ll send you a reset link."
      footer={
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{message}</Alert>
        {devLink && (
          <Alert type="info">
            Dev mode — no email configured. Use this link:{" "}
            <Link href={devLink.replace(/^https?:\/\/[^/]+/, "")} className="font-semibold underline">
              Reset password
            </Link>
          </Alert>
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
