// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { NostrFetcher } from 'nostr-fetch';
import { PropsWithChildren, createContext, useContext } from 'react';

import { NDKInstance } from '@libs/ndk/instance';

import { LoaderIcon } from '@shared/icons';

interface NDKContext {
  ndk: undefined | NDK;
  relayUrls: string[];
  fetcher: NostrFetcher;
}

const NDKContext = createContext<NDKContext>({
  ndk: undefined,
  relayUrls: [],
  fetcher: undefined,
});

const NDKProvider = ({ children }: PropsWithChildren<object>) => {
  const { ndk, relayUrls, fetcher } = NDKInstance();

  if (!ndk) {
    return (
      <div
        data-tauri-drag-region
        className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <LoaderIcon className="h-7 w-7 animate-spin text-neutral-950 dark:text-neutral-50" />
          <p className="font-semibold">Connecting to relays</p>
        </div>
      </div>
    );
  }

  return (
    <NDKContext.Provider
      value={{
        ndk,
        relayUrls,
        fetcher,
      }}
    >
      {children}
    </NDKContext.Provider>
  );
};

const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error('import NDKProvider to use useNDK');
  }
  return context;
};

export { NDKProvider, useNDK };
