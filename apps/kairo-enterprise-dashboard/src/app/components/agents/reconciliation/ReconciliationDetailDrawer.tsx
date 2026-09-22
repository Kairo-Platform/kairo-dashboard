"use client";

import { Drawer, DrawerSize, Tag, TagType } from "@kairo/ui";
import humanize from "underscore.string/humanize";
import styled from "styled-components";
import type { ReconciliationDiscrepancy } from "@/services/Reconciliation";

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding-block: 0.5rem 2rem;

  .Detail__field {
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_03};
    border-radius: 1rem;
    background: ${({ theme }) => theme.colors.ui_07};
  }

  .Detail__field--wide {
    grid-column: 1 / -1;
  }

  .Detail__label {
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text_03};
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .Detail__value {
    color: ${({ theme }) => theme.colors.text_01};
    font-size: 0.9375rem;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
`;

const severityType = (severity: string) =>
  severity.toUpperCase() === "ACTION" ? TagType.RED : TagType.BLUE;

type Props = {
  discrepancy: ReconciliationDiscrepancy;
  onClose: () => void;
};

export const ReconciliationDetailDrawer = ({ discrepancy, onClose }: Props) => (
  <Drawer
    title="Discrepancy details"
    subtitle="Review the reconciliation finding and recommended next step."
    size={DrawerSize.MEDIUM}
    onClose={onClose}
  >
    <DetailContainer>
      <div className="Detail__field Detail__field--wide">
        <p className="Detail__label">Severity</p>
        <Tag type={severityType(discrepancy.severity)}>
          {humanize(discrepancy.severity)}
        </Tag>
      </div>
      <div className="Detail__field">
        <p className="Detail__label">Reference ID</p>
        <p className="Detail__value">{discrepancy.reference || "N/A"}</p>
      </div>
      <div className="Detail__field">
        <p className="Detail__label">Amount</p>
        <p className="Detail__value">{discrepancy.amountDetail || "N/A"}</p>
      </div>
      <div className="Detail__field Detail__field--wide">
        <p className="Detail__label">Discrepancy type</p>
        <p className="Detail__value">{humanize(discrepancy.type)}</p>
      </div>
      <div className="Detail__field Detail__field--wide">
        <p className="Detail__label">Likely cause</p>
        <p className="Detail__value">{discrepancy.likelyCause || "N/A"}</p>
      </div>
      <div className="Detail__field Detail__field--wide">
        <p className="Detail__label">Suggested action</p>
        <p className="Detail__value">{discrepancy.suggestedAction || "N/A"}</p>
      </div>
    </DetailContainer>
  </Drawer>
);
