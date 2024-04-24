export function removeEmpty(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
}
