import { useMeStore } from '@/stores/useMeStore';
import { useEffect } from 'react';

export function useMeData() {
  const store = useMeStore();

  useEffect(() => {
    store.loadAll();
  }, []);

  return store;
}