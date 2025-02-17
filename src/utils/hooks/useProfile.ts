import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

export function useProfile(pubkey: string, embed?: string) {
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
  } = useQuery(
    ['user', pubkey],
    async () => {
      if (embed) {
        const profile: NDKUserProfile = JSON.parse(embed);
        return profile;
      }

      const cleanPubkey = pubkey.replace('-', '');
      const user = ndk.getUser({ hexpubkey: cleanPubkey });
      return await user.fetchProfile();
    },
    {
      enabled: !!ndk,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    }
  );

  return { status, user, error };
}
