"use client";

import styled from "styled-components";
import { useState } from "react";
import {
  Button,
  ButtonClass,
  Flex,
  Modal,
  ModalSize,
} from "@/app/components/ui";
import { FormInput, SelectInput } from "@/app/components/ui/inputs";

const InviteStaffModalContainer = styled.div``;

const DUMMY_ROLES = [
  { label: "Admin", value: "role-admin" },
  { label: "Operations", value: "role-operations" },
  { label: "Support", value: "role-support" },
  { label: "Viewer", value: "role-viewer" },
];

type InvitePayload = {
  email: string;
  roleId: string;
  inviteDuration: number | null;
};

type Props = {
  onClose?: () => void;
  onInvite?: (payload: InvitePayload) => void;
};

export const InviteStaffModal = ({
  onClose = () => undefined,
  onInvite,
}: Props) => {
  const [formState, setFormState] = useState<InvitePayload>({
    email: "",
    roleId: "",
    inviteDuration: 1,
  });
  const [inputErrors, setInputErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formState.email.trim()) {
      errors.email = "Please provide a valid email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = "Please provide a valid email address";
    }
    if (!formState.roleId) {
      errors.roleId = "Please select a role";
    }
    if (
      formState.inviteDuration == null ||
      Number.isNaN(formState.inviteDuration) ||
      formState.inviteDuration < 1
    ) {
      errors.inviteDuration = "Invite duration must be at least 1 day";
    }
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInviteUser = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      onInvite?.(formState);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InviteStaffModalContainer>
      <Modal
        onClose={onClose}
        title="Invite Staff"
        subtitle="Provide details of the new staff you wish to add"
        size={ModalSize.MEDIUM}
      >
        <form noValidate onSubmit={handleInviteUser}>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              label="Email address"
              type="email"
              placeholder="Enter email address"
              value={formState.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormState((prev) => ({ ...prev, email: val }));
                setInputErrors((prev) => ({ ...prev, email: undefined }));
              }}
              message={
                inputErrors.email
                  ? { type: "error", content: inputErrors.email }
                  : undefined
              }
            />
            <SelectInput
              label="Assign role"
              value={formState.roleId ?? ""}
              placeholder="Select role"
              onChange={(val: string) => {
                setFormState((prev) => ({ ...prev, roleId: val || "" }));
                setInputErrors((prev) => ({ ...prev, roleId: undefined }));
              }}
              options={DUMMY_ROLES}
              message={
                inputErrors.roleId
                  ? { type: "error", content: inputErrors.roleId }
                  : undefined
              }
            />
            <FormInput
              label="Invite duration (days)"
              type="number"
              placeholder="Enter invite duration"
              value={formState.inviteDuration ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormState((prev) => ({
                  ...prev,
                  inviteDuration: val === "" ? null : Number(val),
                }));
                setInputErrors((prev) => ({
                  ...prev,
                  inviteDuration: undefined,
                }));
              }}
              message={
                inputErrors.inviteDuration
                  ? { type: "error", content: inputErrors.inviteDuration }
                  : undefined
              }
            />

            <Flex
              align="center"
              justify="flex-end"
              gap="1rem"
              style={{ marginTop: "2rem" }}
            >
              <div>
                <Button
                  classes={[ButtonClass.OUTLINED]}
                  onClick={() => onClose()}
                  style={{ paddingInline: "1.5rem" }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  classes={[ButtonClass.SOLID]}
                  type="submit"
                  style={{ paddingInline: "1.5rem" }}
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </InviteStaffModalContainer>
  );
};

export default InviteStaffModal;
