// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43553#issuecomment-607427237
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * The error that React Query gives is of the type unknown, so we don't know if the error is an object with a message...
 * So to overcome this, we check if the error is an instance of error,
 * If it really is an "Error" we can return the message.
 * If not, let's just do a toString on the unknown.
 * ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43553
 * @param error
 */
export const unknownErrorToString = (error: unknown): string =>
  isError(error) ? error.message : JSON.stringify(error);
