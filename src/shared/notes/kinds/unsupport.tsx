import { NoteActions, NoteMetadata } from '@shared/notes';
import { User } from '@shared/user';

import { LumeEvent } from '@utils/types';

export function NoteKindUnsupport({ event }: { event: LumeEvent }) {
  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-20 -mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              <div className="mt-3 flex w-full flex-col gap-2">
                <div className="inline-flex flex-col gap-1 rounded-md bg-zinc-800 px-2 py-2">
                  <span className="text-sm font-medium leading-none text-zinc-500">
                    Kind: {event.kind}
                  </span>
                  <p className="text-sm leading-none text-fuchsia-500">
                    Lume isn&apos;t fully support this kind
                  </p>
                </div>
                <div className="select-text whitespace-pre-line	break-all text-zinc-100">
                  <p>{event.content.toString()}</p>
                </div>
              </div>
              <NoteActions id={event.event_id} pubkey={event.pubkey} />
            </div>
          </div>
          <NoteMetadata id={event.event_id} />
        </div>
      </div>
    </div>
  );
}
