"use client";

import { Icon } from "@iconify/react";
import { Button, ButtonClass, ButtonSize, Flex } from "@kairo/ui";
import { FileDropZone } from "@kairo/ui/inputs";
import { showErrorNotification } from "@kairo/utils";
import { useState } from "react";
import styled from "styled-components";

const UploadContainer = styled.section`
  max-width: 58rem;
  margin: 1rem auto;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.gray_03};
  border-radius: 2rem;
  background: ${({ theme }) => theme.colors.ui_07};

  .Upload__intro {
    color: ${({ theme }) => theme.colors.text_02};
    line-height: 1.5;
  }

  .Upload__files {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .Upload__fileLabel {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

type ReconciliationUploadProps = {
  loading?: boolean;
  onSubmit: (files: File[]) => void;
};

const ACCEPTED_TYPES = ["text/csv", "application/csv", "application/pdf"];

export const ReconciliationUpload = ({
  loading = false,
  onSubmit,
}: ReconciliationUploadProps) => {
  const [files, setFiles] = useState<Array<File | null>>([null, null]);

  const selectFile = (index: number, file?: File) => {
    if (!file) return;
    const extensionAccepted = /\.(csv|pdf)$/i.test(file.name);
    if (!extensionAccepted && !ACCEPTED_TYPES.includes(file.type)) {
      showErrorNotification({
        message: "Only CSV and PDF files are supported",
      });
      return;
    }
    setFiles((current) =>
      current.map((item, i) => (i === index ? file : item)),
    );
  };

  const ready = files.every(Boolean);

  return (
    <UploadContainer>
      <Flex direction="column" gap="0.5rem">
        <h2>Start a reconciliation</h2>
        <p className="Upload__intro">
          Upload the two transaction sources you want Kairo to compare. Each
          source must be a CSV or PDF file.
        </p>
      </Flex>

      <div className="Upload__files">
        {files.map((file, index) => (
          <div key={index}>
            <p className="Upload__fileLabel">
              Source {String.fromCharCode(65 + index)}
            </p>
            <FileDropZone
              accept=".csv,text/csv,application/pdf"
              fileFormat=".csv or .pdf"
              placeholderLabel={
                file?.name || `Upload source ${String.fromCharCode(65 + index)}`
              }
              onChange={(event) => selectFile(index, event.target.files?.[0])}
              disabled={loading}
            />
          </div>
        ))}
      </div>

      <Flex justify="end">
        <Button
          classes={[ButtonClass.SOLID, ButtonClass.WITH_ICON]}
          disabled={!ready || loading}
          loading={loading}
          style={{ minWidth: ButtonSize.WIDTH_140 }}
          onClick={() =>
            onSubmit(files.filter((file): file is File => Boolean(file)))
          }
        >
          <Icon
            icon="material-symbols:compare-arrows-rounded"
            width={20}
            height={20}
          />
          Run reconciliation
        </Button>
      </Flex>
    </UploadContainer>
  );
};
