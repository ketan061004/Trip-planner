"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plane, Menu, X, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "My Trips" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const onLogout = async () => {
    await logout();
    setMenu(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white">
            <Plane className="h-4 w-4" />
          </span>
          AI Trip Planner
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === l.href ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:border-slate-300"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm font-medium text-slate-700">{user.name?.split(" ")[0]}</span>
              </button>
              {menu && (
                <div
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
                  onMouseLeave={() => setMenu(false)}
                >
                  <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button onClick={onLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button as={Link} href="/login" variant="ghost" size="sm">Login</Button>
              <Button as={Link} href="/signup" size="sm">Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {l.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-slate-100 pt-2">
            {user ? (
              <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            ) : (
              <div className="flex gap-2">
                <Button as={Link} href="/login" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>Login</Button>
                <Button as={Link} href="/signup" size="sm" className="flex-1" onClick={() => setOpen(false)}>Sign up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
