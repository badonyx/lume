import { NDKEvent } from '@nostr-dev-kit/ndk';
import { twMerge } from 'tailwind-merge';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { ImagePreview, LinkPreview, MentionNote, VideoPreview } from '@shared/notes';

import { parser } from '@utils/parser';

export function ChatMessage({ message, self }: { message: NDKEvent; self: boolean }) {
  const decryptedContent = useDecryptMessage(message);
  const richContent = parser(decryptedContent) ?? null;

  return (
    <div
      className={twMerge(
        'my-2 w-max max-w-[400px] rounded-t-xl px-3 py-3',
        self
          ? 'ml-auto rounded-l-xl bg-blue-500 text-white'
          : 'rounded-r-xl bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
      )}
    >
      {!richContent ? (
        <p>Decrypting...</p>
      ) : (
        <div>
          <p className="select-text whitespace-pre-line">{richContent.parsed}</p>
          <div>
            {richContent.images.length > 0 && <ImagePreview urls={richContent.images} />}
            {richContent.videos.length > 0 && <VideoPreview urls={richContent.videos} />}
            {richContent.links.length > 0 && <LinkPreview urls={richContent.links} />}
            {richContent.notes.length > 0 &&
              richContent.notes.map((note: string) => (
                <MentionNote key={note} id={note} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
