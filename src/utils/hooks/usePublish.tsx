import { NDKEvent, NDKKind, NDKPrivateKeySigner, NostrEvent } from '@nostr-dev-kit/ndk';
import destr from 'destr';

import { useNDK } from '@libs/ndk/provider';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function usePublish() {
  const { ndk } = useNDK();
  const { account } = useAccount();

  const privkey = useStronghold((state) => state.privkey);

  const publish = async ({
    content,
    kind,
    tags,
  }: {
    content: string;
    kind: NDKKind | number;
    tags: string[][];
  }): Promise<NDKEvent> => {
    if (!privkey) throw new Error('Private key not found');

    const event = new NDKEvent(ndk);
    const signer = new NDKPrivateKeySigner(privkey);

    event.content = content;
    event.kind = kind;
    event.created_at = Math.floor(Date.now() / 1000);
    event.pubkey = account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  const createZap = async (event: NostrEvent, amount: number, message?: string) => {
    // @ts-expect-error, lumeevent to nostrevent
    event.id = event.event_id;
    // @ts-expect-error, lumeevent to nostrevent
    if (typeof event.content !== 'string') event.content = event.content.original;
    if (typeof event.tags === 'string') event.tags = destr(event.tags);
    if (!privkey) throw new Error('Private key not found');
    if (!ndk.signer) {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    }

    const ndkEvent = new NDKEvent(ndk, event);
    const res = await ndkEvent.zap(amount, message ?? 'test zap from lume');
    return res;
  };

  return { publish, createZap };
}
