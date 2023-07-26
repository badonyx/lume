import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createNote, getNoteByID } from '@libs/storage';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function useEvent(id: string, fallback?: string) {
  const { ndk } = useNDK();
  const { status, data, error, isFetching } = useQuery(['note', id], async () => {
    const result = await getNoteByID(id);
    if (result) {
      return result as LumeEvent;
    } else {
      if (fallback) {
        const embed: LumeEvent = JSON.parse(fallback);
        embed['event_id'] = embed.id;
        await createNote(
          embed.id,
          embed.pubkey,
          embed.kind,
          embed.tags,
          embed.content as unknown as string,
          embed.created_at
        );
        return embed;
      } else {
        const event = await ndk.fetchEvent(id);
        if (event) {
          await createNote(
            event.id,
            event.pubkey,
            event.kind,
            event.tags,
            event.content,
            event.created_at
          );
          event['event_id'] = event.id;
          if (event.kind === 1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            event['content'] = parser(event);
          }
          return event as unknown as LumeEvent;
        } else {
          throw new Error('Event not found');
        }
      }
    }
  });

  return { status, data, error, isFetching };
}
