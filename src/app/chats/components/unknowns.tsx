import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { CancelIcon, PlusIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';
import { Chats } from '@utils/types';

export function UnknownsModal({ data }: { data: Chats[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const openChat = (pubkey: string) => {
    setOpen(false);
    navigate(`/chats/${pubkey}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2.5 rounded-md px-2"
        >
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
            <PlusIcon className="h-3 w-3 text-white" />
          </div>
          <div>
            <h5 className="text-white/50">
              {compactNumber.format(data.length)} unknowns
            </h5>
          </div>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="h-min w-full shrink-0 border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    {data.length} unknowns
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-none text-white/50">
                  All messages from people you not follow
                </Dialog.Description>
              </div>
            </div>
            <div className="flex h-[500px] flex-col overflow-y-auto overflow-x-hidden pb-2 pt-2">
              {data.map((user) => (
                <div
                  key={user.sender_pubkey}
                  className="group flex items-center justify-between px-4 py-2 hover:bg-white/10"
                >
                  <User pubkey={user.sender_pubkey} />
                  <div>
                    <button
                      type="button"
                      onClick={() => openChat(user.sender_pubkey)}
                      className="hidden w-max rounded bg-white/10 px-3 py-1 text-sm font-medium hover:bg-fuchsia-500 group-hover:inline-flex"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
