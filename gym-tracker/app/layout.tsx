import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymTracker",
  description: "Seguimiento de rutinas, cargas y progreso de gimnasio.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "GymTracker",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full bg-fondo" suppressHydrationWarning>
      <body className="min-h-dvh overflow-x-hidden bg-fondo text-texto">
        <TooltipProvider>
          <div className="min-h-dvh w-full overflow-x-hidden lg:flex">
            <Navbar />
            <main className="min-h-dvh min-w-0 flex-1 overflow-x-hidden pb-28 lg:pb-0 lg:pl-24">
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
