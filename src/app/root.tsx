import { NDKUser } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import {
  countTotalNotes,
  createChat,
  createNote,
  getLastLogin,
  updateAccount,
  updateLastLogin,
} from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { nHoursAgo } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';

const totalNotes = await countTotalNotes();
const lastLogin = await getLastLogin();

export function Root() {
  const navigate = useNavigate();

  const { ndk, relayUrls, fetcher } = useNDK();
  const { status, account } = useAccount();

  async function getFollows() {
    const authors: string[] = [];

    const user = ndk.getUser({ hexpubkey: account.pubkey });
    const follows = await user.follows();

    follows.forEach((follow: NDKUser) => {
      authors.push(nip19.decode(follow.npub).data as string);
    });

    // update follows in db
    await updateAccount('follows', authors, account.pubkey);

    return authors;
  }

  async function fetchNotes() {
    try {
      const follows = await getFollows();

      if (follows.length > 0) {
        let since: number;
        if (totalNotes === 0 || lastLogin === 0) {
          since = nHoursAgo(48);
        } else {
          since = lastLogin;
        }

        const events = fetcher.allEventsIterator(
          relayUrls,
          { kinds: [1], authors: follows },
          { since: since },
          { skipVerification: true }
        );
        for await (const event of events) {
          await createNote(
            event.id,
            event.pubkey,
            event.kind,
            event.tags,
            event.content,
            event.created_at
          );
        }
      }

      return true;
    } catch (e) {
      console.log('error: ', e);
    }
  }

  async function fetchChats() {
    try {
      const sendMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [4],
          authors: [account.pubkey],
        },
        { since: lastLogin }
      );

      const receiveMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [4],
          '#p': [account.pubkey],
        },
        { since: lastLogin }
      );

      const events = [...sendMessages, ...receiveMessages];
      for (const event of events) {
        const receiverPubkey = event.tags.find((t) => t[0] === 'p')[1] || account.pubkey;
        await createChat(
          event.id,
          receiverPubkey,
          event.pubkey,
          event.content,
          event.tags,
          event.created_at
        );
      }

      return true;
    } catch (e) {
      console.log('error: ', e);
    }
  }

  /*
  async function fetchChannelMessages() {
    try {
      const ids = [];
      const channels: any = await getChannels();
      channels.forEach((channel) => {
        ids.push(channel.event_id);
      });

      const since = lastLogin === 0 ? dateToUnix(getHourAgo(48, now.current)) : lastLogin;

      const filter: NDKFilter = {
        '#e': ids,
        kinds: [42],
        since: since,
      };

      const events = await prefetchEvents(ndk, filter);
      events.forEach((event) => {
        const channel_id = event.tags[0][1];
        if (channel_id) {
          createChannelMessage(
            channel_id,
            event.id,
            event.pubkey,
            event.kind,
            event.content,
            event.tags,
            event.created_at
          );
        }
      });

      return true;
    } catch (e) {
      console.log('error: ', e);
    }
  }
  */

  useEffect(() => {
    async function prefetch() {
      const notes = await fetchNotes();
      const chats = await fetchChats();
      if (notes && chats) {
        const now = Math.floor(Date.now() / 1000);
        await updateLastLogin(now);
        navigate('/app/space', { replace: true });
      }
    }

    if (status === 'success' && account) {
      prefetch();
    }
  }, [status]);

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="flex h-screen w-full flex-col">
        <div
          data-tauri-drag-region
          className="relative h-11 shrink-0 border border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
        />
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <LoaderIcon className="h-6 w-6 animate-spin text-zinc-100" />
            <div className="text-center">
              <h3 className="text-lg font-semibold leading-tight text-zinc-100">
                Prefetching data...
              </h3>
              <p className="text-zinc-600">
                This may take a few seconds, please don&apos;t close app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
