import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import SiteChrome from "../components/layout/SiteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "AI Trip Planner — Plan Your Perfect Journey",
  description:
    "AI-powered travel planning: personalized itineraries, smart budgets, weather-aware suggestions, and destination-based recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
