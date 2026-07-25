"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Auth pages render their own full-screen layout (AuthShell), so we hide the
// site navbar/footer on those routes.
const BARE_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (bare) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
