import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

import { useState } from 'react';

export const UserMuted = ({ data }: { data: any }) => {
  const profile = useProfile(data.content);
  const [status, setStatus] = useState(data.status);

  const unmute = async () => {
    const { updateItemInBlacklist } = await import('@utils/storage');
    const res = await updateItemInBlacklist(data.content, 0);
    if (res) {
      setStatus(0);
    }
  };

  const mute = async () => {
    const { updateItemInBlacklist } = await import('@utils/storage');
    const res = await updateItemInBlacklist(data.content, 1);
    if (res) {
      setStatus(1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="relative h-9 w-9 shrink rounded-md">
          <img
            src={profile?.picture || DEFAULT_AVATAR}
            alt={data.content}
            className="h-9 w-9 rounded-md object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex w-full flex-1 flex-col items-start gap-0.5 text-start">
          <span className="truncate text-sm font-medium leading-none text-zinc-200">
            {profile?.display_name || profile?.name}
          </span>
          <span className="text-xs leading-none text-zinc-400">{shortenKey(data.content)}</span>
        </div>
      </div>
      <div>
        {status === 1 ? (
          <button
            onClick={() => unmute()}
            className="inline-flex h-6 w-min items-center justify-center rounded px-1.5 text-xs font-medium leading-none text-zinc-400 hover:bg-zinc-800 hover:text-fuchsia-500"
          >
            Unmute
          </button>
        ) : (
          <button
            onClick={() => mute()}
            className="inline-flex h-6 w-min items-center justify-center rounded px-1.5 text-xs font-medium leading-none text-zinc-400 hover:bg-zinc-800 hover:text-fuchsia-500"
          >
            Mute
          </button>
        )}
      </div>
    </div>
  );
};
