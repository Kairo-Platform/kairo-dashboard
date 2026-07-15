"use client";

import { useEffect } from "react";
import {
  Button,
  ButtonClass,
  ButtonSize,
  CopyText,
  Flex,
  Modal,
} from "@kairo/ui";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import { useModal } from "@kairo/hooks";

/** Demo delay before showing unpaid-billing modal. Replace with a real payment check later. */
const DEMO_SHOW_DELAY_MS = 10_000;

export const KairoBillingSummaryModalContainer = styled.div`
  .IconContainer {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.primaryColor};
    border: 1px solid ${(props) => props.theme.colors.primaryColor};
    background-color: ${(props) => props.theme.colors.primaryColor}10;
    border-radius: 50%;
    padding: 0.5rem;
    width: 4rem;
    height: 4rem;
  }

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 500;
    text-align: center;
    color: ${(props) => props.theme.colors.text_01};
    line-height: 1.4;
  }

  .IntroText {
    margin: 0;
    line-height: 1.5;
    text-align: center;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
  }

  .BillingSummaryContainer,
  .PaymentDetailsContainer {
    h3 {
      margin: 0 0 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      color: ${(props) => props.theme.colors.text_02};
    }
  }

  .BillingSummaryContent {
    border: 1.5px solid ${(props) => props.theme.colors.gray_02};
    border-radius: 0.75rem;
    padding: 0 1rem;
    overflow: hidden;
  }

  .KeyValuePair {
    padding: 0.875rem 0;
    border-bottom: 1.5px dashed ${(props) => props.theme.colors.gray_02};

    &:last-child {
      border-bottom: none;
    }
  }

  .PaymentDetailsTitle {
    font-size: 0.95rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
    text-align: center;
  }

  .accountDetails {
    padding: 1.25rem 1rem;
    background-color: ${(props) => props.theme.colors.gray_01};
    border-radius: 1rem;
    width: 100%;
  }

  .accountNumber {
    font-size: 2rem !important;
    font-weight: 700 !important;
    color: ${(props) => props.theme.colors.text_01};
  }

  .key {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
  }

  .value {
    font-size: 1rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_01};
  }
`;

export const KairoBillingSummaryModal = () => {
  const {
    showModal: showKairoBillingSummaryModal,
    openModal: openKairoBillingSummaryModal,
    closeModal: closeKairoBillingSummaryModal,
  } = useModal(false);

  useEffect(() => {
    // TODO: Replace with real unpaid-billing check when backend is ready.
    const timer = window.setTimeout(() => {
      openKairoBillingSummaryModal();
    }, DEMO_SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [openKairoBillingSummaryModal]);

  const handleClose = () => {
    closeKairoBillingSummaryModal();
  };

  const billingSummaryContent = [
    {
      title: "Cost Per Token",
      value: "₦0.45",
    },
    {
      title: "Billing Cycle",
      value: "Monthly",
    },
    {
      title: "Payment Method",
      value: "Bank Transfer",
    },
    {
      title: "Minimum Billable Usage",
      value: "50 tokens",
    },
  ];

  return (
    <KairoBillingSummaryModalContainer>
      {showKairoBillingSummaryModal && (
        <Modal title="" showModalHeader={false} onClose={handleClose}>
          <Flex direction="column" gap="2rem">
            <Flex direction="column" align="center" justify="center" gap="1.25rem">
              <span className="IconContainer">
                <Icon icon="mynaui:confetti" width={30} height={30} />
              </span>

              <div>
                <h2>Your Kairo workspace has been successfully created.</h2>
                <p className="IntroText">
                  Complete billing activation to begin using Kairo agents and
                  operational tools.
                </p>
              </div>
            </Flex>

            <div className="BillingSummaryContainer">
              <h3>Billing summary</h3>
              <div className="BillingSummaryContent">
                {billingSummaryContent.map((item) => (
                  <Flex
                    align="center"
                    justify="space-between"
                    gap="1rem"
                    key={item.title}
                    className="KeyValuePair"
                  >
                    <span className="key">{item.title}</span>
                    <span className="value">{item.value}</span>
                  </Flex>
                ))}
              </div>
            </div>

            <div className="PaymentDetailsContainer">
              <h3 className="PaymentDetailsTitle">
                Kindly make payment to this account details
              </h3>

              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="1rem"
                className="accountDetails"
              >
                <p className="key">Account number</p>
                <CopyText text="1029384756" className="accountNumber">
                  1029384756
                </CopyText>

                <Flex align="center" justify="center" gap="0.5rem">
                  <p className="key">Bank name:</p>
                  <p className="value">PocketMoni</p>
                </Flex>

                <Flex align="center" justify="center" gap="0.5rem">
                  <p className="key">Account name:</p>
                  <p className="value">Kairo</p>
                </Flex>
              </Flex>
            </div>

            <Flex
              align="center"
              justify="flex-end"
              gap="1rem"
            >
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                style={{ minWidth: ButtonSize.WIDTH_140 }}
                onClick={handleClose}
              >
                I've made payment
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}
    </KairoBillingSummaryModalContainer>
  );
};

export default KairoBillingSummaryModal;
