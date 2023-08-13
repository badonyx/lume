import { useState } from 'react';

import { Button } from '@shared/button';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR, FULL_RELAYS } from '@stores/constants';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function NoteReplyForm({ id, pubkey }: { id: string; pubkey: string }) {
  const { publish } = useNostr();
  const { status, user } = useProfile(pubkey);

  const [value, setValue] = useState('');

  const submit = () => {
    const tags = [['e', id, FULL_RELAYS[0], 'reply']];

    // publish event
    publish({ content: value, kind: 1, tags });

    // reset form
    setValue('');
  };

  return (
    <div className="mt-3 flex flex-col rounded-xl bg-white/10">
      <div className="relative w-full flex-1 overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to this thread..."
          className=" relative h-24 w-full resize-none rounded-md bg-transparent px-3 py-3 text-base text-white !outline-none placeholder:text-white/50"
          spellCheck={false}
        />
      </div>
      <div className="w-full border-t border-white/10 px-3 py-3">
        {status === 'loading' ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 rounded">
                <Image
                  src={user?.picture || user?.image}
                  fallback={DEFAULT_AVATAR}
                  alt={pubkey}
                  className="h-11 w-11 rounded-lg bg-white object-cover"
                />
              </div>
              <div>
                <p className="mb-1 text-sm leading-none text-white/50">Reply as</p>
                <p className="text-sm font-medium leading-none text-white">
                  {user?.nip05 || user?.name || displayNpub(pubkey, 16)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => submit()}
                disabled={value.length === 0 ? true : false}
                preset="publish"
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
