/** Provides shared Use Theme React behavior. */
import { useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggle };
}