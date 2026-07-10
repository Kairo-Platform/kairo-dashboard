import React from "react";
import styled from "styled-components";

const PhotoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.inputBorder};
  border-radius: 5px;
  padding: 10px;
  position: relative;
  width: 100%;
  max-width: 147px;
  height: 150px;
  display: flex;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
  }

  input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .FileInput__name {
    margin: 0;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.text_07};
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 30px;
  }

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export type PhotoUploadProps = React.HTMLAttributes<HTMLDivElement> & {
  files?: File[] | FileList | null;
  placeholder?: string;
  aspectRatio?: string | number;
  disabled?: boolean;
};

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  files,
  placeholder = "",
  aspectRatio,
  ...rest
}) => {
  const file = (files as any)?.[0] as File | undefined | null;

  return (
    <PhotoUploadContainer {...rest}>
      <input type="file" accept="image/*" {...(rest as any)} />
      <PreviewImg
        alt="preview"
        src={file ? URL.createObjectURL(file) : "/customer/userIcon.png"}
        isFile={!!file}
        aspect={aspectRatio}
      />
      <p className="FileInput__name">{file ? file.name : placeholder}</p>
    </PhotoUploadContainer>
  );
};
const PreviewImg = styled.img<{ isFile?: boolean; aspect?: string | number }>`
  object-fit: contain;
  ${(p) =>
    p.isFile ? `height: 70%; aspect-ratio: ${p.aspect ?? 1};` : `height: 32px;`}
`;

export default PhotoUpload;
