import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR, IMGPROXY_URL } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NoteReplyUser({ pubkey, time }: { pubkey: string; time: number }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="group flex items-start gap-2.5">
      <div className="relative h-9 w-9 shrink-0 rounded-md">
        <Image
          src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${user?.picture ? user.picture : DEFAULT_AVATAR}`}
          alt={pubkey}
          className="h-9 w-9 rounded-md object-cover"
        />
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold leading-none text-zinc-200 group-hover:underline">
            {user?.display_name || user?.name || shortenKey(pubkey)}
          </span>
          <span className="leading-none text-zinc-500">·</span>
          <span className="leading-none text-zinc-500">{dayjs().to(dayjs.unix(time), true)}</span>
        </div>
      </div>
    </div>
  );
}
