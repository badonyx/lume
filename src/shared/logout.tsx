import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useNavigate } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function Logout() {
  const navigate = useNavigate();

  const { db } = useStorage();
  const { ndk } = useNDK();

  const logout = async () => {
    ndk.signer = null;

    // remove account
    await db.accountLogout();
    await db.secureRemove(db.account.pubkey);
    await db.secureRemove(db.account.pubkey + '-bunker');

    // redirect to welcome screen
    navigate('/auth/welcome');
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
        >
          Logout
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xl dark:bg-white/50" />
        <AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-md rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <div className="flex flex-col gap-1 border-b border-white/5 px-5 py-4">
              <AlertDialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Are you sure!
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-tight text-neutral-600 dark:text-neutral-400">
                You can always log back in at any time. If you just want to switch
                accounts, you can do that by adding an existing account.
              </AlertDialog.Description>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3">
              <AlertDialog.Cancel asChild>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-neutral-900 outline-none hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white outline-none hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
