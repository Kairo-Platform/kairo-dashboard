import React from "react";
import styled from "styled-components";

const FileDropZoneContainer = styled.div`
  flex-grow: 1;
  background: ${(props) => props.theme.colors.white};
  border: 2px dashed ${(props) => props.theme.colors.inputBorder};
  min-height: 94px;
  border-radius: 1rem;
  padding: 26px 10px;
  line-height: 20px;
  letter-spacing: 0.25px;
  max-height: 4rem;
  /* transition: 0.5s; */
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
  }

  input[type="file"] {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
  }

  .FileDropZone__name {
    margin: 0;
    color: ${(props) => props.theme.colors.text_07};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    line-height: 19px;
    text-align: center;

    .dark {
      color: ${(props) => props.theme.colors.text_02};
      font-weight: 700;
    }
  }

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

interface FileDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  files?: FileList | null;
  accept?: string;
  fileFormat?: string;
  additionalText?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderLabel?: React.ReactNode;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  files,
  accept = "application/pdf, image/jpeg",
  fileFormat = ".pdf or .jpeg",
  additionalText,
  onChange,
  placeholderLabel = "Drag file here or click to upload",
  ...rest
}) => {
  const file = files?.[0];

  return (
    <FileDropZoneContainer {...rest} data-disabled={(rest as any).disabled}>
      <input
        type="file"
        accept={accept}
        files={files as any}
        onChange={onChange}
        aria-label="Upload file"
        title="Upload file"
        {...(rest as any)}
      />
      <div className="FileDropZone">
        {file ? (
          <p className="FileDropZone__name">{file.name}</p>
        ) : (
          <div className="FileDropZone__name">
            <p className="dark">{placeholderLabel}</p>
            <p>File should be in {fileFormat} format</p>
            {additionalText && <p>{additionalText}</p>}
          </div>
        )}
      </div>
    </FileDropZoneContainer>
  );
};

export default FileDropZone;
