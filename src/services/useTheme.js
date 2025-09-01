import { ref, watchEffect } from "vue";

const isDark = ref(getInitialTheme());

function getInitialTheme() {
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="));
  return themeCookie ? themeCookie.split("=")[1] === "dark" : false;
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
