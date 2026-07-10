"use client";

import React from "react";
import styled from "styled-components";
import logoIcon from "./icons/image-upload/logo-placeholder.svg";
import photoIcon from "./icons/image-upload/photo-placeholder.svg";
import Image from "next/image";

const ImageUploadContainer = styled.div`
  border-radius: 3px;
  padding: 32px 30px;
  background-color: ${(props) => props.theme.colors.gray_01};
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;

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

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

const iconPlaceholderMap: Record<string, string> = {
  logo: logoIcon,
  photo: photoIcon,
};

export type ImageUploadProps = React.HTMLAttributes<HTMLDivElement> & {
  files?: File[] | FileList | null;
  placeholder?: string;
  iconPlaceholder?: keyof typeof iconPlaceholderMap | string;
  disabled?: boolean;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  placeholder = "",
  iconPlaceholder = "photo",
  ...rest
}) => {
  const file = (files as any)?.[0] as File | undefined | null;
  const imageIconPlaceholder =
    iconPlaceholderMap[iconPlaceholder] || iconPlaceholderMap["photo"];

  return (
    <ImageUploadContainer {...rest}>
      <input type="file" accept="image/*" {...(rest as any)} />
      <Image
        alt="customer photo"
        src={file ? URL.createObjectURL(file) : imageIconPlaceholder}
        style={
          file
            ? { width: "70%", aspectRatio: "1", objectFit: "contain" }
            : { height: "77px", width: "81px" }
        }
      />
    </ImageUploadContainer>
  );
};

export default ImageUpload;
