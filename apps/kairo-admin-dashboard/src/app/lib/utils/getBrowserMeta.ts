export function getBrowserMeta() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  let screenResolution = "";
  if (typeof window !== "undefined" && window.screen) {
    screenResolution = `${window.screen.width}x${window.screen.height}`;
  }

  const platformType = "web";

  // const appVersion = "1.2.0";

  return {
    timezone,
    screenResolution,
    platformType,
    // appVersion,
  };
}
