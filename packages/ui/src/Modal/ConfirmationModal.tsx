import React from "react";
import { Flex } from "../Flex";
import { Button, ButtonClass, ButtonSize } from "../Button";
import { Modal, ModalSize } from "./Modal";

export interface ConfirmationModalProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  cancelButtonClasses?: Array<(typeof ButtonClass)[keyof typeof ButtonClass]>;
  confirmButtonClasses?: Array<(typeof ButtonClass)[keyof typeof ButtonClass]>;
  cancelButtonText?: React.ReactNode;
  confirmButtonText?: React.ReactNode;
  onClose?: () => void;
  onCancel?: () => Promise<any> | void;
  onConfirm?: () => Promise<any> | void;
  confirming?: boolean;
  closeOnConfirm?: boolean;
  cancelOnClose?: boolean;
  asForm?: boolean;
  modalSize?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = "Confirm Action",
  children,
  style,
  cancelButtonClasses = [ButtonClass.SOLID_GREY],
  confirmButtonClasses = [ButtonClass.SOLID],
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
  onClose = () => null,
  onCancel = async () => null,
  onConfirm = async () => null,
  confirming,
  closeOnConfirm = true,
  cancelOnClose = true,
  asForm = false,
  modalSize = ModalSize.SMALL,
}) => {
  const [stateConfirming, setStateConfirming] = React.useState(false);
  const Heading = () => (
    <Flex justify="center" style={{ marginLeft: "2rem" }}>
      <h4>
        <b>{title}</b>
      </h4>
    </Flex>
  );

  const cancelAndClose = async () => {
    await onCancel();
    onClose();
  };
  const close = async () => {
    if (cancelOnClose) await onCancel();
    onClose();
  };

  const confirm = async (e?: React.SyntheticEvent) => {
    if (e && asForm) e.preventDefault();

    try {
      setStateConfirming(true);
      await onConfirm();
      setStateConfirming(false);
      if (closeOnConfirm) onClose();
    } catch {
      setStateConfirming(false);
    }
  };

  const loading = confirming || stateConfirming;
  const getContent = () => {
    if (asForm) {
      return (
        <form onSubmit={confirm}>
          <Flex direction="column" gap="1.5rem">
            {children}
            <Flex wrap="wrap" justify="center">
              <div>
                <Button
                  classes={cancelButtonClasses}
                  size={ButtonSize.WIDTH_140}
                  onClick={cancelAndClose}
                >
                  {cancelButtonText}
                </Button>
              </div>
              <div>
                <Button
                  classes={confirmButtonClasses}
                  // size={ButtonSize.WIDTH_140}
                  loading={loading}
                  onClick={confirm}
                  style={{ minWidth: ButtonSize.WIDTH_140 }}
                >
                  {confirmButtonText}
                </Button>
              </div>
            </Flex>
          </Flex>
        </form>
      );
    }

    return (
      <Flex direction="column" gap="1.5rem">
        {children}
        <Flex wrap="wrap" justify="center">
          <div>
            <Button
              classes={cancelButtonClasses}
              size={ButtonSize.WIDTH_140}
              onClick={cancelAndClose}
            >
              {cancelButtonText}
            </Button>
          </div>
          <div>
            <Button
              classes={confirmButtonClasses}
              // size={ButtonSize.WIDTH_140}
              loading={loading}
              onClick={confirm}
              style={{ minWidth: ButtonSize.WIDTH_140 }}
            >
              {confirmButtonText}
            </Button>
          </div>
        </Flex>
      </Flex>
    );
  };

  return (
    <Modal Heading={Heading} size={modalSize} style={style} onClose={close}>
      {getContent()}
    </Modal>
  );
};

export default ConfirmationModal;
