import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';

export function MiniUser({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

  if (status === 'loading') {
    return <div className="h-4 w-4 animate-pulse rounded bg-zinc-700"></div>;
  }

  return (
    <Image
      src={user?.picture || user?.image || DEFAULT_AVATAR}
      fallback={DEFAULT_AVATAR}
      alt={pubkey}
      className="relative z-20 inline-block h-4 w-4 rounded bg-white ring-1 ring-zinc-800"
    />
  );
}
