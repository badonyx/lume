import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'light-bolt11-decoder';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { compactNumber } from '@utils/number';

export function NoteMetadata({ id }: { id: string }) {
  const setWidget = useWidgets((state) => state.setWidget);

  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['note-metadata', id],
    async () => {
      let replies = 0;
      let zap = 0;
      const users = [];

      const filter: NDKFilter = {
        '#e': [id],
        kinds: [1, 9735],
      };

      const events = await ndk.fetchEvents(filter);
      events.forEach((event: NDKEvent) => {
        switch (event.kind) {
          case 1:
            replies += 1;
            if (users.length < 3) users.push(event.pubkey);
            break;
          case 9735: {
            const bolt11 = event.tags.find((tag) => tag[0] === 'bolt11')[1];
            if (bolt11) {
              const decoded = decode(bolt11);
              const amount = decoded.sections.find((item) => item.name === 'amount');
              const sats = amount.value / 1000;
              zap += sats;
            }
            break;
          }
          default:
            break;
        }
      });

      return { replies, users, zap };
    },
    {
      enabled: !!ndk,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  if (status === 'loading') {
    return (
      <div className="relative z-10 flex items-center gap-3 pb-3">
        <div className="mt-2 h-6 w-11 shrink-0"></div>
        <div className="mt-2 inline-flex h-6">
          <LoaderIcon className="h-4 w-4 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    <div>
      <div className="pb-3" />
    </div>;
  }

  return (
    <div>
      {data.replies > 0 ? (
        <>
          <div className="absolute left-[18px] top-14 h-[calc(100%-6.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
          <div className="relative z-10 flex items-center gap-3 pb-3">
            <div className="mt-2 inline-flex h-6 w-11 shrink-0 items-center justify-center">
              <div className="isolate flex -space-x-1">
                {data.users?.map((user, index) => (
                  <User key={user + index} pubkey={user} />
                ))}
              </div>
            </div>
            <div className="mt-2 inline-flex h-6 items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setWidget(db, {
                    kind: WidgetKinds.local.thread,
                    title: 'Thread',
                    content: id,
                  })
                }
                className="text-neutral-600 dark:text-neutral-400"
              >
                <span className="font-semibold text-white">{data.replies}</span> replies
              </button>
              <span className="text-neutral-600 dark:text-neutral-400">·</span>
              <p className="text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-white">
                  {compactNumber.format(data.zap)}
                </span>{' '}
                zaps
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="pb-3" />
      )}
    </div>
  );
}
