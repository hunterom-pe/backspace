import type { Metadata } from "next";
import { Unbounded, Manrope, Space_Mono } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";
import { createClient } from "@/lib/supabase/server";
import { PresenceProvider } from "@/components/Presence/PresenceProvider";
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

export const metadata: Metadata = {
  title: "backspace",
  description: "A modern rebuild of the MySpace social profile experience.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${manrope.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {user ? <PresenceProvider viewerId={user.id}>{children}</PresenceProvider> : children}
      </body>
    </html>
  );
}
