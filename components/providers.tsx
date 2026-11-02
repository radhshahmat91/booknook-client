"use client";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider, useThemeMode } from "./theme";

function Inner({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster
        position="top-center"
        theme={mode}
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: "var(--font-display)", fontWeight: 600 } }}
      />
    </MotionConfig>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Inner>{children}</Inner>
    </ThemeProvider>
  );
}
