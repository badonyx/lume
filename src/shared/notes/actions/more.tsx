import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { nip19 } from 'nostr-tools';
import { EventPointer } from 'nostr-tools/lib/types/nip19';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { HorizontalDotsIcon } from '@shared/icons';

export function MoreActions({ id, pubkey }: { id: string; pubkey: string }) {
  const [open, setOpen] = useState(false);

  const copyID = async () => {
    await writeText(nip19.neventEncode({ id: id, author: pubkey } as EventPointer));
    setOpen(false);
  };

  const copyLink = async () => {
    await writeText(
      'https://njump.me/' + nip19.neventEncode({ id: id, author: pubkey } as EventPointer)
    );
    setOpen(false);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="inline-flex h-6 w-6 items-center justify-center">
          <HorizontalDotsIcon className="h-4 w-4 text-neutral-800 hover:text-blue-500 dark:text-neutral-200" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl border border-neutral-300 bg-neutral-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800">
          <DropdownMenu.Item asChild>
            <Link
              to={`/notes/text/${id}`}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Focus
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyLink()}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Copy shareable link
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyID()}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Copy ID
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              View profile
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
