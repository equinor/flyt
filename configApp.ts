const c = {
  instrumentationKey: process.env.NEXT_PUBLIC_INSTRUMENTATION_KEY,
};

type DeepRequired<TObject> = {
  [P in keyof TObject]-?: TObject[P] extends infer T0 | undefined
    ? DeepRequired<T0>
    : TObject[P];
};

const throwErrorIfUndefinedValues = <T extends object>(
  obj: T,
  path?: string
): DeepRequired<T> => {
  const entries = Object.entries(obj);
  entries.forEach((entry) => {
    if (entry[1] === undefined) throw Error(`${path}.${entry[0]} is undefined`);
    if (typeof entry[1] === "object")
      throwErrorIfUndefinedValues(
        entry[1],
        path ? `${path}.${entry[0]}` : entry[0]
      );
  });
  return obj as DeepRequired<T>;
};

export const config = c;
