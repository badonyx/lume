import { nip19 } from 'nostr-tools';
import { useMemo, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { EyeOffIcon, EyeOnIcon } from '@shared/icons';

export function AccountSettingsScreen() {
  const { db } = useStorage();

  const [privType, setPrivType] = useState('password');
  const [nsecType, setNsecType] = useState('password');

  const privkey = 'todo';
  const nsec = useMemo(() => nip19.nsecEncode(privkey), [privkey]);

  const showPrivkey = () => {
    if (privType === 'password') {
      setPrivType('text');
    } else {
      setPrivType('password');
    }
  };

  const showNsec = () => {
    if (nsecType === 'password') {
      setNsecType('text');
    } else {
      setNsecType('password');
    }
  };

  return (
    <div className="h-full w-full px-3 pt-11">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-white">Account</h1>
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-3 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pubkey"
              className="text-base font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Public Key
            </label>
            <input
              readOnly
              value={db.account.pubkey}
              className="relative w-full rounded-lg bg-white/10 py-3 pl-3.5 pr-11 text-white !outline-none backdrop-blur-xl placeholder:text-neutral-600 dark:text-neutral-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="npub"
              className="text-base font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Npub
            </label>
            <input
              readOnly
              value={db.account.npub}
              className="relative w-full rounded-lg bg-white/10 py-3 pl-3.5 pr-11 text-white !outline-none backdrop-blur-xl placeholder:text-neutral-600 dark:text-neutral-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="privkey"
              className="text-base font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Private Key
            </label>
            <div className="relative w-full">
              <input
                readOnly
                type={privType}
                value={privkey}
                className="relative w-full rounded-lg bg-white/10 py-3 pl-3.5 pr-11 text-white !outline-none backdrop-blur-xl placeholder:text-neutral-600 dark:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => showPrivkey()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-neutral-700"
              >
                {privType === 'password' ? (
                  <EyeOffIcon
                    width={20}
                    height={20}
                    className="text-neutral-600 group-hover:text-white dark:text-neutral-400"
                  />
                ) : (
                  <EyeOnIcon
                    width={20}
                    height={20}
                    className="text-neutral-600 group-hover:text-white dark:text-neutral-400"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="privkey"
              className="text-base font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Nsec
            </label>
            <div className="relative w-full">
              <input
                readOnly
                type={nsecType}
                value={nsec}
                className="relative w-full rounded-lg bg-white/10 py-3 pl-3.5 pr-11 text-white !outline-none backdrop-blur-xl placeholder:text-neutral-600 dark:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => showNsec()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-neutral-700"
              >
                {privType === 'password' ? (
                  <EyeOffIcon
                    width={20}
                    height={20}
                    className="text-neutral-600 group-hover:text-white dark:text-neutral-400"
                  />
                ) : (
                  <EyeOnIcon
                    width={20}
                    height={20}
                    className="text-neutral-600 group-hover:text-white dark:text-neutral-400"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
