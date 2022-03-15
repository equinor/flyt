import { useRouter } from "next/router";

// Use your url as a key-value store
export function useUrlState(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const router = useRouter();
  const value: string = (router.query[key] as string) || defaultValue;

  function setValue(newValue: string) {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          [key]: newValue,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  return [value, setValue];
}
