import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAccount } from '@libs/storage';

import { Button } from '@shared/button';
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

export function CreateStep1Screen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [setPubkey, setPrivkey] = useOnboarding((state) => [
    state.setPubkey,
    state.setPrivkey,
  ]);
  const [privkeyInput, setPrivkeyInput] = useState('password');
  const [loading, setLoading] = useState(false);

  const privkey = useMemo(() => generatePrivateKey(), []);
  const pubkey = getPublicKey(privkey);
  const npub = nip19.npubEncode(pubkey);
  const nsec = nip19.nsecEncode(privkey);

  // toggle private key
  const showPrivateKey = () => {
    if (privkeyInput === 'password') {
      setPrivkeyInput('text');
    } else {
      setPrivkeyInput('password');
    }
  };

  const account = useMutation({
    mutationFn: (data: {
      npub: string;
      pubkey: string;
      follows: null | string[][];
      is_active: number;
    }) => {
      return createAccount(data.npub, data.pubkey, null, 1);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentAccount'], data);
    },
  });

  const submit = () => {
    setLoading(true);

    setPubkey(pubkey);
    setPrivkey(privkey);

    account.mutate({
      npub,
      pubkey,
      follows: null,
      is_active: 1,
    });

    // redirect to next step
    setTimeout(() => navigate('/auth/create/step-2', { replace: true }), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-100">
          Lume is auto-generated key for you
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-zinc-400">Public Key</span>
          <input
            readOnly
            value={npub}
            className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-zinc-400">Private Key</span>
          <div className="relative">
            <input
              readOnly
              type={privkeyInput}
              value={nsec}
              className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={() => showPrivateKey()}
              className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
            >
              {privkeyInput === 'password' ? (
                <EyeOffIcon
                  width={20}
                  height={20}
                  className="text-zinc-500 group-hover:text-zinc-100"
                />
              ) : (
                <EyeOnIcon
                  width={20}
                  height={20}
                  className="text-zinc-500 group-hover:text-zinc-100"
                />
              )}
            </button>
          </div>
        </div>
        <Button preset="large" onClick={() => submit()}>
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
          ) : (
            'Continue →'
          )}
        </Button>
      </div>
    </div>
  );
}
