export const isIOS = () => {
  const platform = navigator?.userAgent || navigator?.platform || "unknown";
  return /iPhone|iPod|iPad/.test(platform);
};

export default isIOS;
