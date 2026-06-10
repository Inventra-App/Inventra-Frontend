const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
};

const buildWebStorage = (type) => {
  const backend =
    typeof window !== "undefined" && window[type + "Storage"]
      ? window[type + "Storage"]
      : null;

  return {
    getItem(key) {
      try {
        const value = backend ? backend.getItem(key) : null;
        return Promise.resolve(value);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    setItem(key, value) {
      try {
        if (backend) backend.setItem(key, value);
        return Promise.resolve(value);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    removeItem(key) {
      try {
        if (backend) backend.removeItem(key);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    },
  };
};

const storage =
  typeof window !== "undefined" && window.localStorage
    ? buildWebStorage("local")
    : noopStorage;

export default storage;
