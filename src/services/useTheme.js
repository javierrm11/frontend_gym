import { ref, watchEffect } from "vue";

const isDark = ref(getInitialTheme());

function getInitialTheme() {
  // ¿Ya existe cookie?
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="));

  if (themeCookie) {
    return themeCookie.split("=")[1] === "dark";
  }

  // Si no hay cookie, usar el sistema
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}


export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.cookie = `theme=${isDark.value ? "dark" : "light"}; path=/;`;
  };

  watchEffect(() => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return { isDark, toggleTheme };
}
