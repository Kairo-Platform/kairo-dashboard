import { URL } from "@/app/lib/constants";

export const getPaymentDetailsUrl = (paymentRef: string): string => {
  // TODO: implement proper payment details page routing when available
  return "";
};

export const getWalletDetailsUrl = (iuwi: string): string => {
  const isMerchantPath = (
    typeof window !== "undefined" ? window.location.pathname : ""
  ).startsWith("/merchant");
  return isMerchantPath
    ? `${URL.MERCHANT_WALLETS_URL}/${iuwi}`
    : `${URL.WALLETS_URL}/${iuwi}`;
};

// export const getVirtualWalletDetailsUrl = (iuwi) => {
//   const isMerchantPath = Router.pathname.startsWith('/merchant')
//   return isMerchantPath
//     ? `${URL.MERCHANT_VIRTUAL_WALLETS_URL}/${iuwi}`
//     : `${URL.VIRTUAL_WALLETS_URL}/${iuwi}`
// }

export const getTransactionDetailsUrl = (transactionRef: string): string => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isDistributionManagerPath = pathname.startsWith(
    "/distribution-manager"
  );
  const isMerchantPath = pathname.startsWith("/merchant");
  return isDistributionManagerPath
    ? `${URL.DISTRIBUTION_MANAGER_ALL_TRANSACTIONS_URL}/${transactionRef}`
    : isMerchantPath
      ? `${URL.MERCHANT_ALL_TRANSACTIONS_URL}/${transactionRef}`
      : `${URL.ALL_TRANSACTIONS_URL}/${transactionRef}`;
};

export const getWalletHistoryDetailsUrl = (transactionRef: string): string => {
  const isMerchantPath = (
    typeof window !== "undefined" ? window.location.pathname : ""
  ).startsWith("/merchant");
  return isMerchantPath
    ? `${URL.MERCHANT_WALLETS_URL}/${transactionRef}`
    : `${URL.WALLETS_URL}/${transactionRef}`;
};

export const getMmoUserDetailsUrl = (
  userId: string,
  walletType: string = ""
): string => {
  if (
    ["manager-main-wallet", "distribution-manager", "manager"].includes(
      walletType
    )
  ) {
    return `${URL.MERCHANT_AGENTS_URL}/${userId}`;
  }
  return `${URL.MERCHANT_USERS_URL}/${userId}`;
};
