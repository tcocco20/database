const errorHandler = (() => {
  const proxy = (target, err) =>
    new Proxy(target, createHandler(err));

  const createHandler = (err) => ({
    get: (t, p) => p in t ? t[p] : () => {
      console.error(err || `Could not execute ${p}`);
      return;
    },
  });

  return { proxy };
})();

export const proxy = errorHandler.proxy;
