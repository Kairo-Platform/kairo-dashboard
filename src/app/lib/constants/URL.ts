export const URL = {
  DASHBOARD_URL: "/dashboard",
  ADMIN_AI_AGENTS_URL: "/ai-agents",
  ADMIN_SUPPORT_TICKETS_URL: "/support-tickets",
  NOTIFICATIONS_URL: "/notifications",
  ADMIN_CREATE_SUPPORT_TICKET_URL: "/support-tickets/create-ticket",
  ADMIN_SUPPORT_LIVE_CHAT_URL: "/support-live-chat",

  // Settings
  SETTINGS_URL: "/settings",
  PROFILE_AND_SECURITY_SETTINGS_URL: "/settings/profile-and-security",
  BUSINESS_INFORMATION_SETTINGS_URL: "/settings/business-information",
  PERFORMANCE_MANAGEMENT_SETTINGS_URL: "/settings/performance-management",
  ACCESS_CONTROL_SETTINGS_URL: "/settings/access-control",
  CREATE_ACCESS_CONTROL_MODEL_URL: "/settings/access-control/create-model",
  ACCESS_CONTROL_BY_MODEL_ID_URL: "/settings/access-control/[modelId]",
  BUSINESS_INFORMATION_URL: "/settings/business-information",
  TIER_MANAGEMENT_URL: "/settings/tier-management",
  TIER_USERS_URL: "/settings/tier-management/tier-users",
  AUDIT_LOG_GLOBAL_URL: "/settings/audit-log",
  CHANGE_REQUESTS_GLOBAL_URL: "/settings/change-requests",
  ROLES_AND_PERMISSIONS_SETTINGS_URL: "/settings/roles-and-permissions",
  CREATE_NEW_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/settings/roles-and-permissions/staff/new",
  UPDATE_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/settings/roles-and-permissions/staff/edit/[roleId]",
  CREATE_NEW_DISTRIBUTION_MANAGER_ROLE_AND_PERMISSIONS_URL:
    "/settings/roles-and-permissions/distribution-manager/new",
  UPDATE_DISTRIBUTION_MANAGER_ROLE_AND_PERMISSIONS_URL:
    "/settings/roles-and-permissions/distribution-manager/edit/[roleId]",

  // auth flow
  WELCOME_URL: "/auth/welcome",
  ACCESS_CONTROL_FLOWS: "/auth/access-control-flows",
  LOGIN_URL: "/auth/login",
  SIGNUP_URL: "/auth/signup",
  FORGOT_PASSWORD_URL: "/auth/forgot-password",

  // entity auth flow
  ENTITY_LOGIN_URL: "/entity/auth/login",
  ENTITY_SIGNUP_URL: "/entity/auth/signup",
  ENTITY_FORGOT_PASSWORD_URL: "/entity/auth/forgot-password",

  // entities
  ENTITIES_URL: "/entities",
  ADMIN_ENTITY_DETAILS_URL: "/entities/entity-details/[id]",
  ADMIN_ENTITY_BRANCH_DETAILS_URL:
    "/entities/entity-details/[id]/branches/[branchId]",
  ADMIN_ENTITY_BRANCH_WALLET_DETAILS_URL:
    "/entities/entity-details/[id]/branches/[branchId]/wallets/[walletId]",
  ADMIN_BRANCH_SETTINGS_URL: "/entities/merchants/branch-settings",
  ADMIN_STAFF_URL: "/entities/staff",
  ADMIN_MERCHANTS_URL: "/entities/merchants",
  ADMIN_DISTRIBUTION_MANAGERS_URL: "/entities/distribution-managers",
  ADMIN_BUSINESS_AGGREGATORS_URL: "/entities/business-aggregators",
  ADMIN_ONBOARD_BUSINESS_AGGREGATOR_URL:
    "/entities/business-aggregators/onboard-business-aggregator",
  ADMIN_USER_STAFF_URL: "/entities/user-staff",
  ADMIN_INDIVIDUAL_USERS_URL: "/entities/individuals",
  ADMIN_AGENTS_URL: "/entities/agents",
  ADMIN_BUSINESSES_URL: "/entities/businesses",
  ADMIN_AGENCIES_URL: "/entities/agencies",
  ADMIN_ONBOARD_AGENCY_URL: "/entities/agencies/onboard-agency",
  ADMIN_ONBOARD_MERCHANT_URL: "/entities/merchants/onboard-merchant",

  // admin staff auth
  ADMIN_STAFF_LOGIN_URL: "/staff/auth/login",
  ADMIN_STAFF_FORGOT_PASSWORD_URL: "/staff/auth/forgot-password",

  // merchant dashboard
  MERCHANT_DASHBOARD_URL: "/merchant/dashboard",
  MERCHANT_LOGIN_URL: "/merchant/auth/login",
  MERCHANT_SIGNUP_URL: "/merchant/auth/signup",
  MERCHANT_AGENTS_URL: "/merchant/agents",
  MERCHANT_ALL_TRANSACTIONS_URL: "/merchant/all-transactions",
  MERCHANT_NETWORK_TRANSACTIONS_URL: "/merchant/network-transactions",
  MERCHANT_TRANSACTION_CLASS_URL: "/merchant/transaction-classes",
  MERCHANT_WALLETS_URL: "/merchant/wallets",
  MERCHANT_USERS_URL: "/merchant/users",
  MERCHANT_USER_DETAILS_URL: "/merchant/users/[id]",
  MERCHANT_PRICE_CLASSES_URL: "/merchant/price-classes",
  MERCHANT_SUPPORT_TICKETS_URL: "/merchant/support-tickets",
  MERCHANT_NOTIFICATIONS_URL: "/merchant/notifications",
  MERCHANT_CREATE_SUPPORT_TICKET_URL: "/merchant/support-tickets/create-ticket",
  MERCHANT_SUPPORT_LIVE_CHAT_URL: "/merchant/support-live-chat",
  MERCHANT_SETTINGS_URL: "/merchant/settings",
  MERCHANT_BUSINESS_INFORMATION_URL: "/merchant/settings/business-information",
  MERCHANT_PROFILE_AND_SECURITY_URL: "/merchant/settings/profile-and-security",
  MERCHANT_PERFORMANCE_MANAGEMENT_URL:
    "/merchant/settings/performance-management",
  MERCHANT_ROLES_AND_PERMISSIONS_SETTINGS_URL:
    "/merchant/settings/roles-and-permissions",
  MERCHANT_UPDATE_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/merchant/settings/roles-and-permissions/staff/edit/[roleId]",
  MERCHANT_PROFILE_2FA_URL:
    "/merchant/settings/profile-and-security/profile-2fa",
  MERCHANT_PASSWORD_SETUP_URL:
    "/merchant/settings/profile-and-security/password-setup",
  MERCHANT_CREATE_NEW_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/merchant/settings/roles-and-permissions/staff/new",
  MERCHANT_AUDIT_LOG_GLOBAL_URL: "/merchant/settings/audit-log",
  MERCHANT_FORGOT_PASSWORD_URL: "/merchant/auth/forgot-password",
  MERCHANT_COLLECTION_MODELS_URL: "/merchant/collections",
  MERCHANT_COLLECTION_MODEL_PRODUCTS_URL:
    "/merchant/collections/[collectionModelId]",
  MERCHANT_BRANCHES_URL: "/merchant/branches",
  MERCHANT_BRANCH_DETAILS_URL: "/merchant/branches/[branchId]",
  MERCHANT_BRANCH_WALLET_DETAILS_URL:
    "/merchant/branches/[branchId]/wallets/[walletId]",

  // agency dashboard
  AGENCY_DASHBOARD_URL: "/agency/dashboard",
  AGENCY_LOGIN_URL: "/agency/auth/login",
  AGENCY_SIGNUP_URL: "/agency/auth/signup",
  AGENCY_AGENTS_URL: "/agency/agents",
  AGENCY_ALL_TRANSACTIONS_URL: "/agency/all-transactions",
  AGENCY_NETWORK_TRANSACTIONS_URL: "/agency/network-transactions",
  AGENCY_TRANSACTION_CLASS_URL: "/agency/transaction-classes",
  AGENCY_WALLETS_URL: "/agency/wallets",
  AGENCY_USERS_URL: "/agency/users",
  AGENCY_USER_DETAILS_URL: "/agency/users/[id]",
  AGENCY_PRICE_CLASSES_URL: "/agency/price-classes",
  AGENCY_SUPPORT_TICKETS_URL: "/agency/support-tickets",
  AGENCY_NOTIFICATIONS_URL: "/agency/notifications",
  AGENCY_CREATE_SUPPORT_TICKET_URL: "/agency/support-tickets/create-ticket",
  AGENCY_SUPPORT_LIVE_CHAT_URL: "/agency/support-live-chat",
  AGENCY_SETTINGS_URL: "/agency/settings",
  AGENCY_BUSINESS_INFORMATION_URL: "/agency/settings/business-information",
  AGENCY_PROFILE_AND_SECURITY_URL: "/agency/settings/profile-and-security",
  AGENCY_PERFORMANCE_MANAGEMENT_URL: "/agency/settings/performance-management",
  AGENCY_ROLES_AND_PERMISSIONS_SETTINGS_URL:
    "/agency/settings/roles-and-permissions",
  AGENCY_UPDATE_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/agency/settings/roles-and-permissions/staff/edit/[roleId]",
  AGENCY_PROFILE_2FA_URL: "/agency/settings/profile-and-security/profile-2fa",
  AGENCY_PASSWORD_SETUP_URL:
    "/agency/settings/profile-and-security/password-setup",
  AGENCY_CREATE_NEW_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/agency/settings/roles-and-permissions/staff/new",
  AGENCY_AUDIT_LOG_GLOBAL_URL: "/agency/settings/audit-log",
  AGENCY_FORGOT_PASSWORD_URL: "/agency/auth/forgot-password",
  AGENCY_COLLECTION_MODELS_URL: "/agency/collections",
  AGENCY_COLLECTION_MODEL_PRODUCTS_URL:
    "/agency/collections/[collectionModelId]",

  // Business aggregator dashboard
  BUSINESS_AGGREGATOR_URL: "/business-aggregator",
  BUSINESS_AGGREGATOR_DASHBOARD_URL: "/business-aggregator/dashboard",
  BUSINESS_AGGREGATOR_LOGIN_URL: "/business-aggregator/auth/login",
  BUSINESS_AGGREGATOR_SIGNUP_URL: "/business-aggregator/auth/signup",
  BUSINESS_AGGREGATOR_AGENTS_URL: "/business-aggregator/agents",
  BUSINESS_AGGREGATOR_ALL_TRANSACTIONS_URL:
    "/business-aggregator/all-transactions",
  BUSINESS_AGGREGATOR_NETWORK_TRANSACTIONS_URL:
    "/business-aggregator/network-transactions",
  BUSINESS_AGGREGATOR_TRANSACTION_CLASS_URL:
    "/business-aggregator/transaction-classes",
  BUSINESS_AGGREGATOR_WALLETS_URL: "/business-aggregator/wallets",
  BUSINESS_AGGREGATOR_USERS_URL: "/business-aggregator/users",
  BUSINESS_AGGREGATOR_USER_DETAILS_URL: "/business-aggregator/users/[id]",
  BUSINESS_AGGREGATOR_PRICE_CLASSES_URL: "/business-aggregator/price-classes",
  BUSINESS_AGGREGATOR_SUPPORT_TICKETS_URL:
    "/business-aggregator/support-tickets",
  BUSINESS_AGGREGATOR_NOTIFICATIONS_URL: "/business-aggregator/notifications",
  BUSINESS_AGGREGATOR_CREATE_SUPPORT_TICKET_URL:
    "/business-aggregator/support-tickets/create-ticket",
  BUSINESS_AGGREGATOR_SUPPORT_LIVE_CHAT_URL:
    "/business-aggregator/support-live-chat",
  BUSINESS_AGGREGATOR_POS_DEVICES_URL: "/business-aggregator/pos-devices",
  BUSINESS_AGGREGATOR_POS_DEVICE_DETAILS_URL:
    "/business-aggregator/pos-devices/details-by-id/[deviceId]",
  BUSINESS_AGGREGATOR_SETTINGS_URL: "/business-aggregator/settings",
  BUSINESS_AGGREGATOR_BUSINESS_INFORMATION_URL:
    "/business-aggregator/settings/business-information",
  BUSINESS_AGGREGATOR_PROFILE_AND_SECURITY_URL:
    "/business-aggregator/settings/profile-and-security",
  BUSINESS_AGGREGATOR_PERFORMANCE_MANAGEMENT_URL:
    "/business-aggregator/settings/performance-management",
  BUSINESS_AGGREGATOR_ROLES_AND_PERMISSIONS_SETTINGS_URL:
    "/business-aggregator/settings/roles-and-permissions",
  BUSINESS_AGGREGATOR_UPDATE_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/business-aggregator/settings/roles-and-permissions/staff/edit/[roleId]",
  BUSINESS_AGGREGATOR_PROFILE_2FA_URL:
    "/business-aggregator/settings/profile-and-security/profile-2fa",
  BUSINESS_AGGREGATOR_PASSWORD_SETUP_URL:
    "/business-aggregator/settings/profile-and-security/password-setup",
  BUSINESS_AGGREGATOR_CREATE_NEW_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/business-aggregator/settings/roles-and-permissions/staff/new",
  BUSINESS_AGGREGATOR_AUDIT_LOG_GLOBAL_URL:
    "/business-aggregator/settings/audit-log",
  BUSINESS_AGGREGATOR_FORGOT_PASSWORD_URL:
    "/business-aggregator/auth/forgot-password",
  BUSINESS_AGGREGATOR_WALLET_SECURITY_URL:
    "/business-aggregator/wallets/wallet-security",
  BUSINESS_AGGREGATOR_WALLET_TWO_FA_URL:
    "/business-aggregator/wallets/[walletId]/wallet-settings/wallet-2fa",
  BUSINESS_AGGREGATOR_WALLET_SETTINGS_URL:
    "/business-aggregator/wallets/[walletId]/wallet-settings",
  BUSINESS_AGGREGATOR_PERFORM_BUSINESS_WALLET_TRANSACTION_URL:
    "/business-aggregator/wallets/[walletId]/perform-transaction",
  BUSINESS_AGGREGATOR_COLLECTION_MODELS_URL: "/business-aggregator/collections",
  BUSINESS_AGGREGATOR_COLLECTION_MODEL_PRODUCTS_URL:
    "/business-aggregator/collections/[collectionModelId]",

  // transactions
  ALL_TRANSACTIONS_URL: "/all-transactions",
  NETWORK_TRANSACTIONS_URL: "/network-transactions",
  BULK_TRANSACTIONS_URL: "/bulk-transactions",
  TRANSACTION_SETTINGS_URL: "/transaction-settings",
  SYSTEM_TRANSACTION_MODELS_URL:
    "/transaction-settings/system-transaction-models",
  CUSTOM_TRANSACTION_MODELS_URL:
    "/transaction-settings/custom-transaction-models",
  CREATE_CUSTOM_TRANSACTION_MODEL_URL:
    "/transaction-settings/custom-transaction-models/create",
  CUSTOM_TRANSACTION_MODEL_BY_ID_URL:
    "/transaction-settings/custom-transaction-models/[modelId]",
  TRANSACTION_CLASS_URL: "/transaction-settings/transaction-class",
  CREATE_TRANSACTION_CLASS_URL:
    "/transaction-settings/transaction-class/create",
  TRANSACTION_CLASS_BY_ID_URL:
    "/transaction-settings/transaction-class/[transactionClassId]",
  COLLECTION_MODELS_URL: "/transaction-settings/collection-models",
  CREATE_COLLECTION_MODEL_URL: "/transaction-settings/collection-models/create",
  COLLECTION_MODEL_WEBHOOKS_URL:
    "/transaction-settings/collection-models/webhooks",
  COLLECTION_MODEL_EDIT_CONFIGURATION_URL:
    "/transaction-settings/collection-models/edit-configuration/[collectionModelId]",
  COLLECTION_MODEL_TRANSACTIONS_URL:
    "/transaction-settings/collection-models/transactions/[collectionModelId]",

  // pricing
  PRICING_URL: "/pricing",
  PRICE_CLASS_DETAILS_URL: "/pricing/[priceClassId]",
  PRICING_PRICE_SETTINGS_URL: "/pricing/[priceClassId]/price-settings",

  // wallet
  WALLETS_URL: "/wallets",
  BUSINESS_WALLET_URL: "/business-wallet",
  USER_WALLETS_URL: "/user-wallets",
  USER_WALLET_DETAILS_URL: "/user-wallets/[userWalletId]",
  WALLET_SETTINGS_URL: "/wallet-settings",
  WALLET_RULES_URL: "/wallet-settings/rules",
  MERCHANT_WALLET_SECURITY_URL: "/merchant/wallets/wallet-security",
  MERCHANT_WALLET_TWO_FA_URL:
    "/merchant/wallets/[walletId]/wallet-settings/wallet-2fa",
  MERCHANT_WALLET_SETTINGS_URL: "/merchant/wallets/[walletId]/wallet-settings",
  MERCHANT_PERFORM_BUSINESS_WALLET_TRANSACTION_URL:
    "/merchant/wallets/[walletId]/perform-transaction",
  AGENCY_WALLET_SECURITY_URL: "/agency/wallets/wallet-security",
  AGENCY_WALLET_TWO_FA_URL:
    "/agency/wallets/[walletId]/wallet-settings/wallet-2fa",
  AGENCY_WALLET_SETTINGS_URL: "/agency/wallets/[walletId]/wallet-settings",
  AGENCY_PERFORM_BUSINESS_WALLET_TRANSACTION_URL:
    "/agency/wallets/[walletId]/perform-transaction",

  // wallet history
  WALLET_HISTORY_URL: "/wallet-history",

  // pos devices
  POS_DEVICES_URL: "/pos-devices",
  POS_NETWORK_URL: "/pos-network",
  POS_NETWORK_DEVICE_DETAILS_URL: "/pos-network/details-by-id/[deviceId]",
  POS_DEVICE_DETAILS_URL: "/pos-devices/details-by-id/[deviceId]",
  POS_TERMINAL_IDS_URL: "/pos-terminal-ids",
  POS_DEVICE_LOCATION_URL: "/pos-device-locations",
  POS_SETTINGS_URL: "/pos-settings",
  POS_CARD_DEBIT_URL: "/pos-card-debit",
  BULK_MAP_POS_DEVICES_TO_TERMINALS_URL: "/pos-devices/bulk-map-to-terminals",
  BULK_MAP_POS_DEVICES_TO_WALLETS_URL: "/pos-devices/bulk-map-to-wallets",
  BULK_ADD_CAUTION_FEE_TO_WALLETS_URL:
    "/pos-devices/bulk-add-caution-fee-to-wallets",
  CREATE_APPEARANCE_MODEL_URL: "/pos-settings/create-appearance-model",
  APPEARANCE_MODEL_BY_ID_URL: "/pos-settings/appearance-model-by-id/[modelId]",

  MERCHANT_POS_DEVICES_URL: "/merchant/pos-devices",
  MERCHANT_POS_DEVICE_DETAILS_URL:
    "/merchant/pos-devices/details-by-id/[deviceId]",
  MERCHANT_POS_TERMINAL_IDS_URL: "/merchant/pos-terminal-ids",
  MERCHANT_POS_DEVICE_LOCATION_URL: "/merchant/pos-device-locations",

  AGENCY_POS_DEVICES_URL: "/agency/pos-devices",
  AGENCY_POS_DEVICE_DETAILS_URL: "/agency/pos-devices/details-by-id/[deviceId]",
  AGENCY_POS_TERMINAL_IDS_URL: "/agency/pos-terminal-ids",
  AGENCY_POS_DEVICE_LOCATION_URL: "/agency/pos-device-locations",

  // merchants
  MERCHANTS_URL: "/merchants",
  // staffs
  STAFFS_URL: "/staffs",
  // services
  SERVICES_URL: "/services",

  // profile
  PROFILE_AND_SECURITY_URL: "/settings/profile-and-security",
  PROFILE_2FA_URL: "/settings/profile-and-security/profile-2fa",
  PASSWORD_SETUP_URL: "/settings/profile-and-security/password-setup",

  // distribution manager dashboard
  DISTRIBUTION_MANAGER_URL: "/distribution-manager",
  DISTRIBUTION_MANAGER_DASHBOARD_URL: "/distribution-manager/dashboard",
  DISTRIBUTION_MANAGER_LOGIN_URL: "/distribution-manager/auth/login",
  DISTRIBUTION_MANAGER_SIGNUP_URL: "/distribution-manager/auth/signup",
  DISTRIBUTION_MANAGER_FORGOT_PASSWORD_URL:
    "/distribution-manager/auth/forgot-password",
  // distribution manager transactions
  DISTRIBUTION_MANAGER_ALL_TRANSACTIONS_URL:
    "/distribution-manager/all-transactions",
  DISTRIBUTION_MANAGER_NETWORK_TRANSACTIONS_URL:
    "/distribution-manager/network-transactions",
  DISTRIBUTION_MANAGER_COLLECTION_MODELS_URL:
    "/distribution-manager/collections",
  DISTRIBUTION_MANAGER_COLLECTION_MODEL_PRODUCTS_URL:
    "/distribution-manager/collections/[collectionModelId]",
  // distribution manager pos devices
  DISTRIBUTION_MANAGER_POS_NETWORK_URL: "/distribution-manager/pos-network",
  DISTRIBUTION_MANAGER_POS_DEVICES_URL: "/distribution-manager/pos-devices",
  DISTRIBUTION_MANAGER_POS_DEVICE_DETAILS_URL:
    "/distribution-manager/pos-devices/details-by-id/[deviceId]",
  DISTRIBUTION_MANAGER_POS_DEVICE_LOCATION_URL:
    "/distribution-manager/pos-device-locations",
  // distribution manager wallets
  DISTRIBUTION_MANAGER_WALLETS_URL: "/distribution-manager/wallets",
  DISTRIBUTION_MANAGER_WALLET_SECURITY_URL:
    "/distribution-manager/wallets/wallet-security",
  DISTRIBUTION_MANAGER_WALLET_SETTINGS_URL:
    "/distribution-manager/wallets/[walletId]/wallet-settings",
  DISTRIBUTION_MANAGER_WALLET_TWO_FA_URL:
    "/distribution-manager/wallets/[walletId]/wallet-settings/wallet-2fa",
  DISTRIBUTION_MANAGER_PERFORM_BUSINESS_WALLET_TRANSACTION_URL:
    "/distribution-manager/wallets/[walletId]/perform-transaction",
  // distribution manager users
  DISTRIBUTION_MANAGER_USERS_URL: "/distribution-manager/users",
  DISTRIBUTION_MANAGER_USER_DETAILS_URL: "/distribution-manager/users/[id]",
  DISTRIBUTION_MANAGER_MERCHANTS_URL: "/distribution-manager/users/merchants",
  DISTRIBUTION_MANAGER_BUSINESS_AGGREGATORS_URL:
    "/distribution-manager/users/business-aggregators",
  // distribution manager support
  DISTRIBUTION_MANAGER_SUPPORT_TICKETS_URL:
    "/distribution-manager/support-tickets",
  DISTRIBUTION_MANAGER_NOTIFICATIONS_URL: "/distribution-manager/notifications",
  DISTRIBUTION_MANAGER_CREATE_SUPPORT_TICKET_URL:
    "/distribution-manager/support-tickets/create-ticket",
  DISTRIBUTION_MANAGER_SUPPORT_LIVE_CHAT_URL:
    "/distribution-manager/support-live-chat",
  // distribution manager settings
  DISTRIBUTION_MANAGER_SETTINGS_URL: "/distribution-manager/settings",
  DISTRIBUTION_MANAGER_BUSINESS_INFORMATION_URL:
    "/distribution-manager/settings/business-information",
  DISTRIBUTION_MANAGER_PROFILE_AND_SECURITY_URL:
    "/distribution-manager/settings/profile-and-security",
  DISTRIBUTION_MANAGER_PERFORMANCE_MANAGEMENT_URL:
    "/distribution-manager/settings/performance-management",
  DISTRIBUTION_MANAGER_ROLES_AND_PERMISSIONS_SETTINGS_URL:
    "/distribution-manager/settings/roles-and-permissions",
  DISTRIBUTION_MANAGER_CREATE_NEW_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/distribution-manager/settings/roles-and-permissions/staff/new",
  DISTRIBUTION_MANAGER_UPDATE_STAFF_ROLE_AND_PERMISSIONS_URL:
    "/distribution-manager/settings/roles-and-permissions/staff/edit/[roleId]",
  DISTRIBUTION_MANAGER_CREATE_NEW_DISTRIBUTION_MANAGER_ROLE_AND_PERMISSIONS_URL:
    "/distribution-manager/settings/roles-and-permissions/distribution-manager/new",
  DISTRIBUTION_MANAGER_UPDATE_DISTRIBUTION_MANAGER_ROLE_AND_PERMISSIONS_URL:
    "/distribution-manager/settings/roles-and-permissions/distribution-manager/edit/[roleId]",
  DISTRIBUTION_MANAGER_AUDIT_LOG_GLOBAL_URL:
    "/distribution-manager/settings/audit-log",
  DISTRIBUTION_MANAGER_PROFILE_2FA_URL:
    "/distribution-manager/settings/profile-and-security/profile-2fa",
  DISTRIBUTION_MANAGER_PASSWORD_SETUP_URL:
    "/distribution-manager/settings/profile-and-security/password-setup",
  // backward compatibility for legacy references
  DISTRIBUTION_MANAGER_WALLET_URL: "/distribution-manager/wallet",
  DISTRIBUTION_MANAGER_WALLET_HISTORY_URL:
    "/distribution-manager/wallet-history",
  DISTRIBUTION_MANAGER_All_TRANSACTIONS_URL:
    "/distribution-manager/all-transactions",
};

export default URL;
