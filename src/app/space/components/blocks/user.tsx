import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { NoteKind_1, NoteSkeleton } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { UserProfile } from '@shared/userProfile';

import { nHoursAgo } from '@utils/date';
import { LumeEvent, Widget } from '@utils/types';

export function UserBlock({ params }: { params: Widget }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { ndk } = useNDK();
  const { status, data } = useQuery(['user-feed', params.content], async () => {
    const events = await ndk.fetchEvents({
      kinds: [1],
      authors: [params.content],
      since: nHoursAgo(48),
    });
    return [...events] as unknown as LumeEvent[];
  });

  const rowVirtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 2,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  return (
    <div className="relative w-[400px] shrink-0 bg-white/10">
      <TitleBar id={params.id} title={params.title} />
      <div ref={parentRef} className="scrollbar-hide h-full overflow-y-auto pb-20">
        <div className="px-3 pt-1.5">
          <UserProfile pubkey={params.content} />
        </div>
        <div>
          <h3 className="mt-4 px-3 text-lg font-semibold text-white">Latest postrs</h3>
          <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
            {status === 'loading' ? (
              <div className="px-3 py-1.5">
                <div className="rounded-md bg-white/10 px-3 py-3">
                  <NoteSkeleton />
                </div>
              </div>
            ) : itemsVirtualizer.length === 0 ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-white/10 px-3 py-6">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-center text-sm text-white">
                      No new posts from this user in 48 hours ago
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="relative w-full"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                <div
                  className="absolute left-0 top-0 w-full"
                  style={{
                    transform: `translateY(${
                      itemsVirtualizer[0].start - rowVirtualizer.options.scrollMargin
                    }px)`,
                  }}
                >
                  {itemsVirtualizer.map((virtualRow) => (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                    >
                      <NoteKind_1 event={data[virtualRow.index]} />
                    </div>
                  ))}
                  <div className="h-20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
