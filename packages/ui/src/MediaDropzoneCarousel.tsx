"use client";

import { useState, useRef, FC, ChangeEvent } from "react";
import styled from "styled-components";
import Flex from "./Flex";
import AddFillIcon from "remixicon-react-redux/AddFillIcon";
import ArrowLeftSLineIcon from "remixicon-react-redux/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react-redux/ArrowRightSLineIcon";
import Image from "next/image";

const MediaDropzoneCarouselContainer = styled.div`
  position: relative;
  height: 25rem;
  width: 20rem;
  border-radius: 1rem;
  border: 1.5px solid ${(props) => props.theme.colors.gray_01};
  background-color: ${(props) => props.theme.colors.gray_02};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border: 1.5px solid ${(props) => props.theme.colors.primary};

    .nav_button {
      opacity: 1;
      visibility: visible;
    }
  }

  .slider_container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 1rem;
  }

  .slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center center;
    z-index: 1;

    &.active {
      z-index: 2;
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }

    &.prev {
      transform: translate(-30%, 30%) scale(0.85);
      opacity: 0;
      z-index: 0;
    }

    &.next {
      transform: translate(30%, 30%) scale(0.85);
      opacity: 0;
      z-index: 0;
    }

    &.entering-from-right {
      transform: translate(30%, 30%) scale(0.85);
      opacity: 0;
      z-index: 3;

      &.active {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
    }

    &.exiting-to-left {
      z-index: 1;
      transform: translate(-30%, 30%) scale(0.85);
      opacity: 0;
    }
  }

  .media_item {
    width: 20rem;
    height: 25rem;
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: 1rem;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .media_dropzone_add {
    width: 20rem;
    height: 25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;

    input[type="file"] {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
    }
  }

  .add_icon {
    width: 5rem;
    height: 5rem;
    color: ${(props) => props.theme.colors.text_07};
    background-color: ${(props) => props.theme.colors.gray_03};
    border-radius: 50%;
    padding: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${(props) => props.theme.colors.gray_02};
      transform: scale(1.05);
    }
  }

  .nav_button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    border: none;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    cursor: pointer;
    color: ${(props) => props.theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 3;

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%) scale(1.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;

      &:hover {
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
  }

  .prev_button {
    left: 0.5rem;
  }

  .next_button {
    right: 0.5rem;
  }

  .slide_indicator {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 3;
  }

  .indicator_dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background-color: ${(props) => props.theme.colors.primary};
      transform: scale(1.2);
    }
  }
`;

export interface MediaItem {
  srcUrl: string;
  alt?: string;
  type: "image" | "video";
  file?: File;
}

export interface MediaDropzoneCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  media?: MediaItem[];
  accepts?: string;
  fileTypes?: string[];
  onFileUpload?: (files: File[]) => void;
  multiple?: boolean;
}

export const MediaDropzoneCarousel: FC<MediaDropzoneCarouselProps> = ({
  media = [],
  accepts = "image/*,video/*",
  fileTypes = ["image/jpeg", "image/png", "video/mp4"],
  onFileUpload,
  multiple = true,
  ...rest
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<MediaItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Combine existing media with uploaded files
  const mediaArray = Array.isArray(media) ? media : [];
  const allMedia = [...mediaArray, ...uploadedFiles];
  const totalSlides = allMedia.length > 0 ? allMedia.length + 1 : 1;
  const showNavigation = totalSlides > 1;

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const filesList = event.target.files;
    if (!filesList) return;

    const files = Array.from(filesList);

    const newFiles: MediaItem[] = files.map((file) => ({
      srcUrl: window.URL.createObjectURL(file),
      alt: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    if (onFileUpload) {
      onFileUpload(files);
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning) return;

    const newSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
    if (newSlide === currentSlide) return;

    setIsTransitioning(true);
    setCurrentSlide(newSlide);

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const goToPrevious = () => {
    goToSlide(currentSlide - 1);
  };

  const goToNext = () => {
    goToSlide(currentSlide + 1);
  };

  const getSlideClassName = (index: number) => {
    if (index === currentSlide) {
      return "slide active";
    }
    if (index < currentSlide) {
      return "slide prev exiting-to-left";
    }
    if (index > currentSlide) {
      return "slide next entering-from-right";
    }
    return "slide";
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    if (item.type === "video") {
      return (
        <video key={index} controls>
          <source src={item.srcUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <Image key={index} src={item.srcUrl} alt={item.alt as string} />;
  };

  return (
    <MediaDropzoneCarouselContainer {...rest}>
      <div className="slider_container">
        {/* Render existing media and uploaded files */}
        {allMedia.map((item, index) => (
          <div key={index} className={getSlideClassName(index)}>
            <div className="media_item">{renderMediaItem(item, index)}</div>
          </div>
        ))}

        {/* Add button slide - always last */}
        <div className={getSlideClassName(allMedia.length)}>
          <div className="media_dropzone_add">
            <input
              ref={fileInputRef}
              type="file"
              accept={accepts}
              multiple={multiple}
              onChange={handleFileUpload}
              aria-label={"Upload media"}
              title={"Upload media"}
            />
            <AddFillIcon className="add_icon" />
          </div>
        </div>

        {/* Navigation buttons - only show if there are multiple slides */}
        {showNavigation && (
          <>
            <button
              className="nav_button prev_button"
              onClick={goToPrevious}
              disabled={currentSlide === 0}
              aria-label={"Previous slide"}
              title={"Previous slide"}
            >
              <ArrowLeftSLineIcon />
            </button>
            <button
              className="nav_button next_button"
              onClick={goToNext}
              disabled={currentSlide === totalSlides - 1}
              aria-label={"Next slide"}
              title={"Next slide"}
            >
              <ArrowRightSLineIcon />
            </button>
          </>
        )}

        {/* Slide indicators - only show if there are multiple slides */}
        {showNavigation && (
          <div className="slide_indicator">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`indicator_dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </MediaDropzoneCarouselContainer>
  );
};

export default MediaDropzoneCarousel;
