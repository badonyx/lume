import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { LoaderIcon } from '@shared/icons';
import {
  ArticleNote,
  FileNote,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';

import { useNostr } from '@utils/hooks/useNostr';

export function UserLatestPosts({ pubkey }: { pubkey: string }) {
  const { getEventsByPubkey } = useNostr();
  const { status, data } = useQuery(['user-posts', pubkey], async () => {
    return await getEventsByPubkey(pubkey);
  });

  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <NoteWrapper key={event.id} event={event}>
              <TextNote />
            </NoteWrapper>
          );
        case NDKKind.Repost:
          return <Repost key={event.id} event={event} />;
        case 1063:
          return (
            <NoteWrapper key={event.id} event={event}>
              <FileNote />
            </NoteWrapper>
          );
        case NDKKind.Article:
          return (
            <NoteWrapper key={event.id} event={event}>
              <ArticleNote />
            </NoteWrapper>
          );
        default:
          return (
            <NoteWrapper key={event.id} event={event}>
              <UnknownNote />
            </NoteWrapper>
          );
      }
    },
    [data]
  );

  return (
    <div className="mt-4 border-t border-neutral-300 pt-3 dark:border-neutral-700">
      <h3 className="mb-4 px-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Latest post
      </h3>
      <div>
        {status === 'loading' ? (
          <div className="px-3">
            <div className="inline-flex h-16 w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-300 text-sm font-medium dark:bg-neutral-700">
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Loading latest posts...
            </div>
          </div>
        ) : data.length < 1 ? (
          <div className="px-3">
            <div className="inline-flex h-16 w-full items-center justify-center rounded-lg bg-neutral-300 text-sm font-medium dark:bg-neutral-700">
              No posts from 24 hours ago
            </div>
          </div>
        ) : (
          data.map((event) => renderItem(event))
        )}
      </div>
    </div>
  );
}
