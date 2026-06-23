export default defineNuxtRouteMiddleware((to, from) => {
  // Check if user is authenticated
  const isAuthenticated = useCookie("dashboard_admin").value;
  if (to.name === "admin-login") {
    return;
  }
  if (!isAuthenticated) {
    return navigateTo({ name: "admin-login" });
  }
});
