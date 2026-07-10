// import { COMMISSION_TYPE } from 'shared-constants'
const COMMISSION_TYPE_CONST = {
  fixed: "fixed",
  percentage: "percentage",
  percentageAtFixed: "percentageAtFixed",
} as const;

type CommissionTypeKeys =
  (typeof COMMISSION_TYPE_CONST)[keyof typeof COMMISSION_TYPE_CONST];

type CommissionMap = {
  fixed: CommissionTypeKeys;
  percentage: CommissionTypeKeys;
  percentageAtFixed: CommissionTypeKeys;
};

export type FieldLike = {
  type?: string;
  fixed?: number | null;
  percentage?: number | null;
  fieldKey?: string;
  [k: string]: any;
};

export const mapPricing = (
  field: FieldLike = {},
  COMMISSION_TYPE: CommissionMap = COMMISSION_TYPE_CONST as CommissionMap,
) => {
  const { type } = field;
  const { fixed, percentage, percentageAtFixed } = COMMISSION_TYPE;
  return {
    type,
    fixed: [fixed, percentageAtFixed].includes(type as any)
      ? (field.fixed ?? null)
      : null,
    percentage: [percentage, percentageAtFixed].includes(type as any)
      ? (field.percentage ?? null)
      : null,
  } as { type?: string; fixed: number | null; percentage: number | null };
};

export type Pricing = {
  fixed?: number | null;
  percentage?: number | null;
  type?: string;
};

export const getPricing = (
  pricing: Pricing = {
    fixed: 0,
    percentage: 0,
    type: COMMISSION_TYPE_CONST.fixed,
  },
): string | number | undefined => {
  if (pricing.type === COMMISSION_TYPE_CONST.fixed) {
    return pricing.fixed ?? undefined;
  }
  if (pricing.type === COMMISSION_TYPE_CONST.percentage) {
    return `${pricing.percentage}%`;
  }
  if (pricing.type === COMMISSION_TYPE_CONST.percentageAtFixed) {
    return `${pricing.percentage}% capped at ${pricing.fixed}`;
  }
  return undefined;
};

export const mapFieldKeyCommission = (
  field: FieldLike = {},
  COMMISSION_TYPE: CommissionMap = COMMISSION_TYPE_CONST as CommissionMap,
) => {
  const { fieldKey } = field;
  const pricing = mapPricing(field, COMMISSION_TYPE);
  return {
    fieldKey,
    ...pricing,
  } as { fieldKey?: string } & ReturnType<typeof mapPricing>;
};
