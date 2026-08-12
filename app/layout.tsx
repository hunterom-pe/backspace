import type { Metadata } from "next";
import {
  Unbounded,
  Manrope,
  Space_Mono,
  Bungee,
  Fredoka,
  Permanent_Marker,
  Special_Elite,
  Pacifico,
  Baloo_2,
} from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";
import { createClient } from "@/lib/supabase/server";
import { PresenceProvider } from "@/components/Presence/PresenceProvider";
import { Footer } from "@/components/Footer/Footer";
import { CursorTrail } from "@/components/CursorTrail/CursorTrail";
import { Confetti } from "@/components/Confetti/Confetti";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Theme display fonts — each profile theme (see lib/theme.ts) overrides
// --font-display with one of these inside its [data-profile-theme] scope
// in globals.css. Only fetched by the browser when actually referenced by
// rendered text, so themes nobody has picked yet cost nothing.
const bungee = Bungee({
  variable: "--font-punk",
  subsets: ["latin"],
  weight: "400",
});

const fredoka = Fredoka({
  variable: "--font-scene",
  subsets: ["latin"],
  weight: "700",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-skater",
  subsets: ["latin"],
  weight: "400",
});

const specialElite = Special_Elite({
  variable: "--font-emo",
  subsets: ["latin"],
  weight: "400",
});

const pacifico = Pacifico({
  variable: "--font-sunset",
  subsets: ["latin"],
  weight: "400",
});

const baloo2 = Baloo_2({
  variable: "--font-glitter",
  subsets: ["latin"],
  weight: "700",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backspace2026.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "backspace",
    template: "%s · backspace",
  },
  description: "Hit backspace on the last twenty years of the internet.",
  openGraph: {
    title: "backspace",
    description: "Hit backspace on the last twenty years of the internet.",
    siteName: "backspace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "backspace",
    description: "Hit backspace on the last twenty years of the internet.",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${manrope.variable} ${spaceMono.variable} ${bungee.variable} ${fredoka.variable} ${permanentMarker.variable} ${specialElite.variable} ${pacifico.variable} ${baloo2.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {user ? <PresenceProvider viewerId={user.id}>{children}</PresenceProvider> : children}
        <Footer />
        <CursorTrail />
        <Confetti />
      </body>
    </html>
  );
}
