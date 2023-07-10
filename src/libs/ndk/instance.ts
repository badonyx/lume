// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { getSetting } from '@libs/storage';

const setting = await getSetting('relays');
const relays = JSON.parse(setting);

export const NDKInstance = () => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>(relays);

  useEffect(() => {
    loadNdk(relays);
  }, []);

  async function loadNdk(explicitRelayUrls: string[]) {
    const ndkInstance = new NDK({ explicitRelayUrls });

    try {
      await ndkInstance.connect();
    } catch (error) {
      console.error('ERROR loading NDK NDKInstance', error);
    }

    setNDK(ndkInstance);
    setRelayUrls(explicitRelayUrls);
  }

  return {
    ndk,
    relayUrls,
    loadNdk,
  };
};
