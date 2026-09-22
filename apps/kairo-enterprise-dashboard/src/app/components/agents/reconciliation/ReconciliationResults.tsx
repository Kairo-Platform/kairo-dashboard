"use client";

import { Icon } from "@iconify/react";
import { Flex, Table, Tag, TagType } from "@kairo/ui";
import humanize from "underscore.string/humanize";
import styled from "styled-components";
import { useState } from "react";
import { ReconciliationDetailDrawer } from "./ReconciliationDetailDrawer";
import type {
  ReconciliationDiscrepancy,
  ReconciliationResult,
} from "@/services/Reconciliation";

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .Results__summary {
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.primaryColor};
    border-radius: 1.5rem;
    background: ${({ theme }) => `${theme.colors.primaryColor}0A`};
    color: ${({ theme }) => theme.colors.text_01};

    h2 {
      font-size: 0.9375rem;
      line-height: 1.5rem;
    }
    p {
      margin-top: 0.75rem;
      line-height: 1.4;
      font-size: 0.9375rem;
    }
  }

  .Results__cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .Results__card {
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_03};
    border-radius: 1.25rem;
    background: ${({ theme }) => theme.colors.ui_07};

    span {
      color: ${({ theme }) => theme.colors.text_03};
      font-size: 0.875rem;
    }
    strong {
      display: block;
      margin-top: 0.75rem;
      font-size: 1.5rem;
    }
  }

  .Results__text {
    display: block;
    max-width: 22rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const severityType = (severity: string) =>
  severity.toUpperCase() === "ACTION" ? TagType.RED : TagType.BLUE;

export const ReconciliationResults = ({
  result,
}: {
  result: ReconciliationResult;
}) => {
  const [selectedDiscrepancy, setSelectedDiscrepancy] =
    useState<ReconciliationDiscrepancy | null>(null);
  const cards = [
    ["Matched value", result.matchedValue],
    ["Matched groups", result.matchedGroups],
    ["Action required", result.actionRequiredCount],
    ["Unreadable rows", result.unreadableRows],
  ];
  const headers = [
    {
      title: "Type",
      render: (row: ReconciliationDiscrepancy) => humanize(row.type),
    },
    {
      title: "Severity",
      render: (row: ReconciliationDiscrepancy) => (
        <Tag type={severityType(row.severity)}>{humanize(row.severity)}</Tag>
      ),
    },
    {
      title: "Reference",
      render: (row: ReconciliationDiscrepancy) => row.reference,
    },
    {
      title: "Amount",
      render: (row: ReconciliationDiscrepancy) => row.amountDetail,
    },
    {
      title: "Likely cause",
      render: (row: ReconciliationDiscrepancy) => (
        <span className="Results__text" title={row.likelyCause}>
          {row.likelyCause}
        </span>
      ),
    },
    {
      title: "Suggested action",
      render: (row: ReconciliationDiscrepancy) => (
        <span className="Results__text" title={row.suggestedAction}>
          {row.suggestedAction}
        </span>
      ),
    },
  ];

  return (
    <ResultsContainer>
      <div className="Results__summary">
        <Flex align="center" gap="0.5rem">
          <Icon icon="mingcute:ai-fill" width={20} height={20} />
          <h2>
            {result.inSync
              ? "Sources are in sync"
              : "Reconciliation completed with discrepancies"}
          </h2>
        </Flex>
        <p>{result.summary}</p>
      </div>
      <div className="Results__cards">
        {cards.map(([label, value]) => (
          <div className="Results__card" key={String(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {result.discrepancies.length > 0 && (
        <section>
          <h3>Discrepancies</h3>
          <Table
            headers={headers}
            rows={result.discrepancies}
            onRowClick={({ row }) => setSelectedDiscrepancy(row)}
          />
        </section>
      )}
      {selectedDiscrepancy && (
        <ReconciliationDetailDrawer
          discrepancy={selectedDiscrepancy}
          onClose={() => setSelectedDiscrepancy(null)}
        />
      )}
    </ResultsContainer>
  );
};
