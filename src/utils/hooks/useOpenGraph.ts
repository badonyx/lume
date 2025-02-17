import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';

import { Opengraph } from '@utils/types';

export function useOpenGraph(url: string) {
  const { status, data, error } = useQuery(
    ['opg', url],
    async () => {
      const res: Opengraph = await invoke('opengraph', { url });
      if (!res) {
        throw new Error('fetch preview failed');
      }
      return res;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  return {
    status,
    data,
    error,
  };
}
