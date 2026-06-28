"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import cameraIcon from "./icons/video-input/camera.png";
import { useModal, useCaptureImage } from "@/app/lib/hooks";
import { Flex } from "../Flex";
import { Button, ButtonClass, ButtonSize } from "../Button";
import { Modal, ModalSize } from "../Modal";
import Image from "next/image";

const ImageCaptureContainer = styled.div`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.inputBorder};
  border-radius: 5px;
  position: relative;
  width: 100%;
  height: 180px;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
  }

  .image-capture__modal--trigger {
    cursor: pointer;
    height: 100%;
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .error-msg {
    color: ${(props) => props.theme.colors.red};
    font-size: small;
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

  .photo {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 200px;
    height: 200px;
  }
`;

const VideoWrapper = styled.div`
  background-color: #eee;
  width: 100%;
  min-height: 240px;
  aspect-ratio: 1;
`;

const Photo = styled.div<{ src?: string }>`
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 200px;
  height: 200px;
  background-image: url(${(p) => p.src});
`;

function getDataURL(file: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result?.toString() ?? null);
    reader.onerror = (error) => reject(error);
  });
}

export type ImageCaptureProps = {
  placeholder?: string;
  onCaptureSuccess?: (imageBlob: Blob) => void | unknown;
  onCaptureError?: (error: unknown) => void | unknown;
};

type UseCaptureImageReturn = {
  error: Error | null;
  setError: (err: any) => void;
  startCamera: () => Promise<void> | void;
  stopCamera: () => void;
  captureImage: () => Promise<Blob>;
  videoRef: React.RefObject<HTMLVideoElement>;
  mediaStream: MediaStream | null;
};

export const ImageCapture: React.FC<ImageCaptureProps> = ({
  placeholder = "",
  onCaptureSuccess = (imageBlob) => imageBlob,
  onCaptureError = (error) => error,
}) => {
  const [imgSrc, setImgSrc] = React.useState<string>("");
  const {
    error,
    setError,
    startCamera,
    stopCamera,
    captureImage,
    videoRef,
    mediaStream,
  } = useCaptureImage() as any;

  const pathname = usePathname();
  const prevPathRef = React.useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      stopCamera();
    }
    prevPathRef.current = pathname;
  }, [pathname, stopCamera]);

  useEffect(() => {
    // ensure effect returns void
    onCaptureError(error);
  }, [error, onCaptureError]);

  const {
    showModal: showImageCaptureModal,
    openModal: openImageCaptureModal,
    closeModal: closeImageCaptureModal,
  } = useModal();

  useEffect(() => {
    if (showImageCaptureModal) {
      // auto start camera
      startCamera();
      // clear previous error
      setError(null);
    }
  }, [showImageCaptureModal, startCamera, setError]);

  const stopCameraAndCloseImageCaptureModal = () => {
    stopCamera();
    closeImageCaptureModal();
  };

  const handleCapture = async () => {
    const imgBlob = await captureImage();
    onCaptureSuccess(imgBlob);
    let dataURL: string | null = null;
    try {
      dataURL = await getDataURL(imgBlob);
    } catch (e) {
      onCaptureError(e);
    }
    setImgSrc(dataURL ?? "");
    stopCameraAndCloseImageCaptureModal();
  };

  return (
    <ImageCaptureContainer>
      <div
        className="image-capture__modal--trigger"
        onClick={openImageCaptureModal}
      >
        {imgSrc === "" ? (
          <Flex direction="column" gap="10px" align="center">
            <Image src={cameraIcon} alt="camera" />
            <p className="FileInput__name">{placeholder}</p>
          </Flex>
        ) : (
          <Photo src={imgSrc} />
        )}
      </div>

      {showImageCaptureModal && (
        <Modal
          title="Image Capture"
          onClose={stopCameraAndCloseImageCaptureModal}
          size={ModalSize.SMALL}
        >
          <Flex direction="column">
            <VideoWrapper>
              <video className="video" width="100%" autoPlay ref={videoRef} />
            </VideoWrapper>

            {error && <p className="error-msg">{error.message}</p>}

            <Flex wrap="wrap">
              {mediaStream ? (
                <Button
                  onClick={stopCamera}
                  classes={[ButtonClass.SOLID_GREY]}
                  size={ButtonSize.FULL}
                >
                  Stop Camera
                </Button>
              ) : (
                <Button
                  onClick={startCamera}
                  classes={[ButtonClass.SOLID_GREY]}
                  size={ButtonSize.FULL}
                >
                  Start Camera
                </Button>
              )}

              <Button
                classes={[ButtonClass.SOLID]}
                onClick={handleCapture}
                size={ButtonSize.FULL}
                disabled={!mediaStream}
              >
                Capture Image
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}
    </ImageCaptureContainer>
  );
};
export default ImageCapture;
