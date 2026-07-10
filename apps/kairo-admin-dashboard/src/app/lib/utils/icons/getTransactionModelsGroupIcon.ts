import { transactionModelsGroupIcons } from "./transactionModelsGroupIcons";

export const getTransactionModelsGroupIcon = (service?: string): any => {
  const svc = String(service || "").trim();
  if (!svc) return null;

  const iconsMap = transactionModelsGroupIcons as any;

  if (iconsMap[svc]) return iconsMap[svc];

  const lower = svc.toLowerCase();
  const ci = Object.keys(iconsMap).find(
    (k) => String(k).toLowerCase() === lower
  );
  if (ci) return iconsMap[ci];

  const found = Object.keys(iconsMap).find((k) => {
    const kLower = String(k).toLowerCase();
    if (!kLower || !lower) return false;
    if (lower.includes(kLower) || kLower.includes(lower)) return true;
    const sWords = lower.split(/[^a-z0-9]+/).filter(Boolean);
    return sWords.includes(kLower);
  });

  if (found) return iconsMap[found];

  return null;
};

export default getTransactionModelsGroupIcon;
