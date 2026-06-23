export const useApiFetchRaw = async <T>(request: string, opts: any = {}) => {
  const config = useRuntimeConfig();
  const token = useCookie("dashboard_admin_token");

  if (token.value) {
    opts = {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
    };
  }
  return $fetch<T>(request, {
    baseURL: config.public.apiBase,
    ...opts,
  });
};
