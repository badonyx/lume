import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { nip19 } from 'nostr-tools';
import { EventPointer } from 'nostr-tools/lib/types/nip19';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeftIcon, CheckCircleIcon, ReplyIcon, ShareIcon } from '@shared/icons';
import {
  ArticleNote,
  FileNote,
  NoteActions,
  NoteReplyForm,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { ReplyList } from '@shared/notes/replies/list';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function TextNoteScreen() {
  const { id } = useParams();
  const { status, data } = useEvent(id);

  const navigate = useNavigate();
  const replyRef = useRef(null);

  const [isCopy, setIsCopy] = useState(false);

  const share = async () => {
    await writeText(
      'https://njump.me/' +
        nip19.neventEncode({ id: data.id, author: data.pubkey } as EventPointer)
    );
    // update state
    setIsCopy(true);
    // reset state after 2 sec
    setTimeout(() => setIsCopy(false), 2000);
  };

  const scrollToReply = () => {
    replyRef.current.scrollIntoView();
  };

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote content={event.content} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-8 scroll-smooth px-4">
      <div className="col-span-1">
        <div className="flex flex-col items-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex flex-col divide-y divide-neutral-200 rounded-xl bg-neutral-100 dark:divide-neutral-800 dark:bg-neutral-900">
            <button
              type="button"
              onClick={share}
              className="inline-flex h-12 w-12 items-center justify-center rounded-t-xl"
            >
              {isCopy ? (
                <CheckCircleIcon className="h-5 w-5 text-teal-500" />
              ) : (
                <ShareIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={scrollToReply}
              className="inline-flex h-12 w-12 items-center justify-center rounded-b-xl"
            >
              <ReplyIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative col-span-6 flex flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          {status === 'loading' ? (
            <div className="px-3 py-1.5">Loading...</div>
          ) : (
            <div className="flex h-min w-full flex-col px-3">
              <div className="mb-3 border-b border-neutral-100 pb-3 dark:border-neutral-900">
                <User pubkey={data.pubkey} time={data.created_at} variant="thread" />
                <div className="mt-3">{renderKind(data)}</div>
                <div className="mt-3">
                  <NoteActions id={id} pubkey={data.pubkey} extraButtons={false} />
                </div>
              </div>
            </div>
          )}
          <div ref={replyRef} className="px-3">
            <div className="mb-3 border-b border-neutral-100 pb-3 dark:border-neutral-900">
              <NoteReplyForm id={id} />
            </div>
            <ReplyList id={id} />
          </div>
        </div>
      </div>
      <div className="col-span-1" />
    </div>
  );
}
