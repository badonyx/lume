import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAccount } from '@libs/storage';

import { Button } from '@shared/button';
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

import { useOnboarding } from '@stores/onboarding';
import { useStronghold } from '@stores/stronghold';

export function CreateStep1Screen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);
  const setTempPrivkey = useOnboarding((state) => state.setTempPrivkey);
  const setPubkey = useOnboarding((state) => state.setPubkey);
  const setStep = useOnboarding((state) => state.setStep);

  const [privkeyInput, setPrivkeyInput] = useState('password');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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

  const download = async () => {
    await writeTextFile('lume-keys.txt', `Public key: ${npub}\nPrivate key: ${nsec}`, {
      dir: BaseDirectory.Download,
    });
    setDownloaded(true);
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

    setPrivkey(privkey);
    setTempPrivkey(privkey); // only use if user close app and reopen it
    setPubkey(pubkey);

    account.mutate({
      npub,
      pubkey,
      follows: null,
      is_active: 1,
    });

    // redirect to next step
    setTimeout(() => navigate('/auth/create/step-2', { replace: true }), 1200);
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/create/step-1');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Save your access key!</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white/50">Public Key</span>
          <input
            readOnly
            value={npub}
            className="relative h-11 w-full rounded-lg bg-white/10 px-3.5 py-1 text-white !outline-none placeholder:text-white/50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white/50">Private Key</span>
          <div className="relative">
            <input
              readOnly
              type={privkeyInput}
              value={nsec}
              className="relative h-11 w-full rounded-lg bg-white/10 py-1 pl-3.5 pr-11 text-white !outline-none placeholder:text-white/50"
            />
            <button
              type="button"
              onClick={() => showPrivateKey()}
              className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-white/10"
            >
              {privkeyInput === 'password' ? (
                <EyeOffIcon className="h-4 w-4 text-white/50 group-hover:text-white" />
              ) : (
                <EyeOnIcon className="h-4 w-4 text-white/50 group-hover:text-white" />
              )}
            </button>
          </div>
          <div className="mt-2 text-sm text-white/50">
            <p>
              Your private key is your password. If you lose this key, you will lose
              access to your account! Copy it and keep it in a safe place. There is no way
              to reset your private key.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
          >
            {loading ? (
              <>
                <span className="w-5" />
                <span>Creating...</span>
                <LoaderIcon className="h-5 w-5 animate-spin text-white" />
              </>
            ) : (
              <>
                <span className="w-5" />
                <span>I have saved my key, continue</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
          {downloaded ? (
            <span className="inline-flex h-11 w-full items-center justify-center text-sm text-white/50">
              Saved in Download folder
            </span>
          ) : (
            <Button preset="large-alt" onClick={() => download()}>
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
