import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { AccountMoreActions } from '@shared/accounts/more';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

import { useActivities } from '@stores/activities';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';

export function ActiveAccount() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, user } = useProfile(db.account.pubkey);
  const { sub } = useNostr();

  const location = useLocation();
  const addActivity = useActivities((state) => state.addActivity);
  const addNewMessage = useActivities((state) => state.addNewMessage);

  const svgURI =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(minidenticon(db.account.pubkey, 90, 50));

  useEffect(() => {
    const filter: NDKFilter = {
      kinds: [
        NDKKind.Text,
        NDKKind.EncryptedDirectMessage,
        NDKKind.Repost,
        NDKKind.Reaction,
        NDKKind.Zap,
      ],
      since: Math.floor(Date.now() / 1000),
      '#p': [db.account.pubkey],
    };

    sub(
      filter,
      async (event) => {
        console.log('receive event: ', event.id);

        if (event.kind !== NDKKind.EncryptedDirectMessage) {
          addActivity(event);
        }

        const user = ndk.getUser({ hexpubkey: event.pubkey });
        await user.fetchProfile();

        switch (event.kind) {
          case NDKKind.Text:
            return await sendNativeNotification(
              `${user.profile.displayName || user.profile.name} has replied to your note`
            );
          case NDKKind.EncryptedDirectMessage: {
            if (location.pathname !== '/chats') {
              addNewMessage();
              return await sendNativeNotification(
                `${
                  user.profile.displayName || user.profile.name
                } has send you a encrypted message`
              );
            } else {
              break;
            }
          }
          case NDKKind.Repost:
            return await sendNativeNotification(
              `${user.profile.displayName || user.profile.name} has reposted to your note`
            );
          case NDKKind.Reaction:
            return await sendNativeNotification(
              `${user.profile.displayName || user.profile.name} has reacted ${
                event.content
              } to your note`
            );
          case NDKKind.Zap:
            return await sendNativeNotification(
              `${user.profile.displayName || user.profile.name} has zapped to your note`
            );
          default:
            break;
        }
      },
      false
    );
  }, []);

  if (status === 'loading') {
    return (
      <div className="aspect-square h-auto w-full animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <Link to={`/users/${db.account.pubkey}`} className="relative inline-block">
        <Avatar.Root>
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={db.account.pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="aspect-square h-auto w-full rounded-md"
          />
          <Avatar.Fallback delayMs={150}>
            <img
              src={svgURI}
              alt={db.account.pubkeypubkey}
              className="aspect-square h-auto w-full rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <NetworkStatusIndicator />
      </Link>
      <AccountMoreActions pubkey={db.account.pubkey} />
    </div>
  );
}
