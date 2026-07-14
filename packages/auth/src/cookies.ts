export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
  expires?: Date;
};

export type AuthCookieConfig = {
  /** Cookie prefix, e.g. kairo_admin or kairo_enterprise */
  prefix: string;
  secure?: boolean;
};

export const authCookieNames = (prefix: string) => ({
  accessToken: `${prefix}_access`,
  refreshToken: `${prefix}_refresh`,
  session: `${prefix}_session`,
  gat: `${prefix}_gat`,
  userId: `${prefix}_user_id`,
  userType: `${prefix}_user_type`,
  orgId: `${prefix}_org_id`,
});

export const defaultCookieOptions = (
  config: AuthCookieConfig,
): Required<Pick<CookieOptions, "httpOnly" | "secure" | "sameSite" | "path">> => ({
  httpOnly: true,
  secure: config.secure ?? process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});
