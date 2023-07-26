import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { getActiveAccount } from '@libs/storage';

export function useAccount() {
  const { ndk } = useNDK();
  const { status, data: account } = useQuery(
    ['currentAccount'],
    async () => {
      const account = await getActiveAccount();
      if (account?.pubkey) {
        const user = ndk.getUser({ hexpubkey: account?.pubkey });
        await user.fetchProfile();
        return { ...account, ...user.profile };
      }
      return account;
    },
    {
      staleTime: Infinity,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );

  return { status, account };
}
