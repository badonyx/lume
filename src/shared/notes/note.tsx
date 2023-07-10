import { useMemo } from 'react';

import { Kind1 } from '@shared/notes/contents/kind1';
import { Kind1063 } from '@shared/notes/contents/kind1063';
import { NoteMetadata } from '@shared/notes/metadata';
import { NoteParent } from '@shared/notes/parent';
import { Repost } from '@shared/notes/repost';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

interface Note {
  event: LumeEvent;
  skipMetadata?: boolean;
}

export function Note({ event, skipMetadata = false }: Note) {
  const isRepost = event.kind === 6;

  const renderParent = useMemo(() => {
    if (!isRepost && event.parent_id && event.parent_id !== event.event_id) {
      return <NoteParent id={event.parent_id} />;
    } else {
      return null;
    }
  }, [event.parent_id]);

  const renderRepost = useMemo(() => {
    if (isRepost) {
      return <Repost event={event} />;
    } else {
      return null;
    }
  }, [event.kind]);

  const renderContent = useMemo(() => {
    switch (event.kind) {
      case 1: {
        const content = parser(event);
        return <Kind1 content={content} />;
      }
      case 6:
        return null;
      case 1063:
        return <Kind1063 metadata={event.tags} />;
      default:
        return (
          <div className="flex flex-col gap-2">
            <div className="inline-flex flex-col gap-1 rounded-md bg-zinc-800 px-2 py-2">
              <span className="text-sm font-medium leading-none text-zinc-500">
                Kind: {event.kind}
              </span>
              <p className="text-sm leading-none text-fuchsia-500">
                Lume isn&apos;t fully support this kind in newsfeed
              </p>
            </div>
            <div className="select-text whitespace-pre-line	break-words text-base text-zinc-100">
              <p>{event.content}</p>
            </div>
          </div>
        );
    }
  }, [event.kind]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        {renderParent}
        <div className="flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} repost={isRepost} />
          <div className="-mt-6 pl-[49px]">
            {renderContent}
            {!isRepost && !skipMetadata ? (
              <NoteMetadata
                id={event.event_id}
                rootID={event.parent_id}
                eventPubkey={event.pubkey}
              />
            ) : (
              <div className={isRepost ? 'h-0' : 'h-3'} />
            )}
          </div>
        </div>
        {renderRepost}
      </div>
    </div>
  );
}
