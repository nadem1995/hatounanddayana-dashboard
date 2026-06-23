export const useLogout = async () => {
  const responce: any = await useApiFetchRaw("logout");
  const dashboardAdmin = useCookie("dashboard_admin");
  const dashboardAdminToken = useCookie("dashboard_admin_token");
  dashboardAdmin.value = undefined;
  dashboardAdminToken.value = undefined;

  return responce;
};
