import { useQuery } from '@tanstack/react-query';

interface UseMockResourceOptions<T> {
  queryKey: readonly unknown[];
  data: T;
  delay?: number;
}

const wait = (delay: number) => new Promise((resolve) => window.setTimeout(resolve, delay));

export const useMockResource = <T,>({ queryKey, data, delay = 300 }: UseMockResourceOptions<T>) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      await wait(delay);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
