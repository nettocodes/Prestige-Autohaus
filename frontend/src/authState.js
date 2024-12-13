// src/authState.js
import { reactive } from "vue";

export const authState = reactive({
  isLoggedIn: !!localStorage.getItem("token"),
  isAdmin: (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.role === 1;
    } catch {
      return false;
    }
  })(),
});

export function updateAuthState() {
  authState.isLoggedIn = !!localStorage.getItem("token");
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    authState.isAdmin = user?.role === 1;
  } catch {
    authState.isAdmin = false;
  }
}
