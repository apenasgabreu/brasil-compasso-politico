type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type DisabledAuthUser = { name: string | null; email: string | null };

/**
 * A aplicação não oferece contas, login ou perfis. Mantido apenas como uma
 * interface neutra para componentes herdados que não fazem parte do fluxo público.
 */
export function useAuth(_options?: UseAuthOptions) {
  return {
    user: null as DisabledAuthUser | null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: async () => undefined,
    logout: async () => undefined,
  };
}
