import * as Tooltip from '@radix-ui/react-tooltip';

import { ThreadIcon } from '@shared/icons';
import { MoreActions } from '@shared/notes/actions/more';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

import { BLOCK_KINDS } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { useAccount } from '@utils/hooks/useAccount';

export function NoteActions({
  id,
  pubkey,
  noOpenThread,
  root,
}: {
  id: string;
  pubkey: string;
  noOpenThread?: boolean;
  root?: string;
}) {
  const { account } = useAccount();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-2 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-2">
          <NoteReply id={id} pubkey={pubkey} root={root} />
          <NoteReaction id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          {(account?.lud06 || account?.lud16) && <NoteZap id={id} />}
        </div>
        {!noOpenThread && (
          <>
            <div className="mx-2 block h-4 w-px bg-white/10" />
            <Tooltip.Root delayDuration={150}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    setWidget({
                      kind: BLOCK_KINDS.thread,
                      title: 'Thread',
                      content: id,
                    })
                  }
                  className="group inline-flex h-7 w-7 items-center justify-center"
                >
                  <ThreadIcon className="h-5 w-5 text-white group-hover:text-fuchsia-400" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
                  Open thread
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </>
        )}
        <MoreActions id={id} pubkey={pubkey} />
      </div>
    </Tooltip.Provider>
  );
}
