export type OrganizationApiKey = {
  id: string;
  name: string;
  prefix: string;
  key?: string;
};

export type CreateOrganizationApiKeyRequest = {
  name: string;
};
