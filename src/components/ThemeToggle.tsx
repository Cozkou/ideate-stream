import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-text-subtle hover:text-foreground"
    >
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all light:-rotate-90 light:scale-0" />
      <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all light:rotate-0 light:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;