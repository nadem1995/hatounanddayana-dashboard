export const useApiFetch = <T>(request: string, opts?: any) => {
  const config = useRuntimeConfig();
  const { locale } = useI18n();

  const token = useCookie("dashboard_admin_token");

  return useFetch<T>(request, {
    baseURL: config.public.apiBase,
    ...opts,
    headers: {
      ...opts?.headers,
      ...(token.value && { Authorization: `Bearer ${token.value}` }),
      "Accept-Language": computed(() => locale.value),
    },
    watch: [locale, ...(opts?.watch || [])],
  });
};
