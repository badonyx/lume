import { BLOCK_KINDS } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <button
      type="button"
      onClick={() =>
        setWidget({
          kind: BLOCK_KINDS.user,
          title: user?.nip05 || user?.name || user?.display_name,
          content: pubkey,
        })
      }
      className="break-words font-normal text-blue-400 no-underline hover:text-blue-500"
    >
      {user?.nip05 ||
        user?.name ||
        user?.display_name ||
        user?.username ||
        displayNpub(pubkey, 16)}
    </button>
  );
}
