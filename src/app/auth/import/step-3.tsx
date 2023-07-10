import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { useNDK } from '@libs/ndk/provider';
import { updateAccount } from '@libs/storage';

import { Button } from '@shared/button';
import { LoaderIcon } from '@shared/icons';

import { useAccount } from '@utils/hooks/useAccount';
import { setToArray } from '@utils/transform';

export function ImportStep3Screen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { ndk } = useNDK();
  const { status, account } = useAccount();

  const update = useMutation({
    mutationFn: (follows: string[]) => {
      return updateAccount('follows', follows, account.pubkey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentAccount'] });
    },
  });

  const submit = async () => {
    try {
      // show loading indicator
      setLoading(true);

      const user = ndk.getUser({ hexpubkey: account.pubkey });
      const follows = await user.follows();

      // follows as list
      const followsList = setToArray(follows);

      // update
      update.mutate([...followsList, account.pubkey]);

      // redirect to next step
      setTimeout(() => navigate('/auth/onboarding', { replace: true }), 1200);
    } catch {
      console.log('error');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold">
          {loading ? 'Creating...' : 'Continue with'}
        </h1>
      </div>
      <div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 p-4">
        {status === 'loading' ? (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="h-11 w-11 animate-pulse rounded-lg bg-zinc-800" />
              <div>
                <div className="mb-1 h-4 w-16 animate-pulse rounded bg-zinc-800" />
                <div className="h-3 w-36 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <User pubkey={account.pubkey} />
            <Button preset="large" onClick={() => submit()}>
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
              ) : (
                'Continue →'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
