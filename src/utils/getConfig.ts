// https://github.com/microsoft/TypeScript/issues/33128#issuecomment-526018445
export {};
declare global {
  interface Window {
    _env_: never;
  }
}

export function getConfig(param: string): string {
  if (!window._env_) return "";
  if (!window._env_[param]) {
    throw new Error("Missing required environment variable: " + param);
  }
  return window._env_[param];
}
