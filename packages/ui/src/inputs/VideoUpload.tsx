"use client";

import React from "react";
import styled from "styled-components";
import cameraIcon from "./icons/video-input/camera.png";
import Image from "next/image";

const VideoUploadContainer = styled.div`
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
  height: 180px;
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
    text-transform: capitalize;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.text_07};
    max-width: 100%;
    max-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &[data-disabled="true"] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export interface VideoUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  files?: File[] | FileList | null;
  placeholder?: string;
  accept?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  files,
  placeholder = "",
  accept,
  onChange,
  disabled,
  ariaLabel,
  ...rest
}) => {
  const DEFAULT_ACCEPTABLE_FORMATS = "video/mp4,video/x-m4v,video/*";
  const file = (files as any)?.[0] as File | undefined | null;

  return (
    <VideoUploadContainer data-disabled={disabled} {...rest}>
      <input
        type="file"
        accept={accept ?? DEFAULT_ACCEPTABLE_FORMATS}
        onChange={onChange}
        aria-label={ariaLabel ?? placeholder ?? "Upload video"}
        disabled={disabled}
      />
      <Image src={cameraIcon} alt="camera" />
      <p className="FileInput__name">{file ? file.name : placeholder}</p>
    </VideoUploadContainer>
  );
};

export default VideoUpload;
