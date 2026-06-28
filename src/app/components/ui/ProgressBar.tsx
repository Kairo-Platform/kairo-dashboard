"use client";

import { theme } from "@/app/styles/Theme";
import styled from "styled-components";

const ProgressBarWrapper = styled.div`
  .progress {
    padding: 8px 0 0 0;
    .progress-bar {
      width: 100%;
      background-color: ${(props) => props.theme.colors.grayButtonBg};
      border-radius: 2px;

      .progress-bar-fill {
        display: block;
        height: 6px;
        background-color: ${(props) => props.theme.colors.buttonRed};
        border-radius: 3px;
        width: 80%;
        transition: width 500ms ease-in-out;
      }
    }
  }
`;
export const ProgressBar = ({ progress = 0 }) => {
  return (
    <ProgressBarWrapper>
      <div className="progress">
        <div className="progress-bar">
          <span
            className="progress-bar-fill"
            style={{
              width: `${progress || 0}%`,
              backgroundColor:
                progress < 70
                  ? theme.colors.primaryColor
                  : theme.colors.buttonRed,
            }}
          />
        </div>
      </div>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
