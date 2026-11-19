"use client";

import { useEffect, useState } from "react";
import { useEntity } from "simpler-state";
import styled from "styled-components";
import { Button, ButtonClass, Flex, Modal } from "@kairo/ui";
import { FormInput } from "@kairo/ui/inputs";
import { showErrorNotification, showSuccessNotification } from "@kairo/utils";
import { parseApiError } from "@/lib/utils/parseApiError";
import {
  channelFormFields,
  channelFormPayload,
  channelFormValues,
  type ChannelFormValues,
} from "@/services/Flow";
import {
  fetchInstagramApp,
  instagramAppStore,
  resetInstagramApp,
  saveInstagramApp,
} from "@/app/store/instagramApp";

const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: ${(props) => props.theme.colors.text_01};
  .MerchantInstagramAppSettings__callback {
    overflow-wrap: anywhere;
    color: ${(props) => props.theme.colors.text_02};
    font-size: 0.875rem;
  }
`;

export function MerchantInstagramAppSettings() {
  const { fetchingConfig, config } = useEntity(instagramAppStore);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ChannelFormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => () => resetInstagramApp(), []);

  const close = () => {
    if (saving) return;
    setOpen(false);
    setValues({});
    setErrors({});
    resetInstagramApp();
  };
  const fields = config ? channelFormFields(config, values) : [];
  const supported =
    fields.length > 0 &&
    fields.every(
      (field) => !field.visible || ["text", "password"].includes(field.type),
    );
  return (
    <>
      <Button
        type="button"
        classes={[ButtonClass.OUTLINED]}
        disabled={fetchingConfig}
        loading={fetchingConfig}
        style={{ minWidth: "13rem", alignSelf: "flex-start" }}
        onClick={async () => {
          const next = await fetchInstagramApp();
          if (next) {
            setValues(channelFormValues(next));
            setErrors({});
            setOpen(true);
          }
        }}
      >
        Configure Instagram app
      </Button>
      {open && config && (
        <Modal title="Merchant Instagram app" onClose={close}>
          <Content
            onSubmit={async (event) => {
              event.preventDefault();
              if (saving || !supported) return;
              const payload = channelFormPayload(fields, values);
              setErrors(payload.errors);
              if (Object.keys(payload.errors).length) return;
              setSaving(true);
              try {
                const next = await saveInstagramApp({
                  ...payload.body,
                  ...(config.schema.variantKey
                    ? {
                        [config.schema.variantKey]:
                          values[config.schema.variantKey],
                      }
                    : {}),
                });
                setValues(channelFormValues(next));
                showSuccessNotification({
                  message: "Instagram app settings saved",
                });
              } catch (error) {
                showErrorNotification({
                  message: parseApiError(
                    error,
                    "Unable to save Instagram app settings.",
                  ),
                });
              } finally {
                setSaving(false);
              }
            }}
          >
            {config.schema.variantKey && (
              <Flex
                gap="0.5rem"
                wrap="wrap"
                role="group"
                aria-label="Merchant Instagram login setup"
              >
                {config.schema.variants?.map((variant) => (
                  <Button
                    key={variant.value}
                    type="button"
                    classes={[
                      values[config.schema.variantKey!] === variant.value
                        ? ButtonClass.SOLID
                        : ButtonClass.OUTLINED,
                    ]}
                    style={{ height: "2rem" }}
                    disabled={saving}
                    aria-pressed={
                      values[config.schema.variantKey!] === variant.value
                    }
                    onClick={() => {
                      setValues(channelFormValues(config, variant.value));
                      setErrors({});
                    }}
                  >
                    {variant.label}
                  </Button>
                ))}
              </Flex>
            )}
            {fields
              .filter((field) => field.visible)
              .map((field) => (
                <FormInput
                  key={field.key}
                  name={field.key}
                  label={`${field.label}${field.required ? "" : " (optional)"}`}
                  required={field.required}
                  type={field.type}
                  inputMode={field.inputMode ?? undefined}
                  maxLength={field.maxLength ?? undefined}
                  placeholder={field.placeholder}
                  autoComplete={
                    field.type === "password" ? "new-password" : undefined
                  }
                  disabled={saving || field.readOnly}
                  value={String(values[field.key] ?? "")}
                  message={
                    errors[field.key]
                      ? { type: "error", content: errors[field.key] }
                      : undefined
                  }
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }));
                    setErrors((current) => ({ ...current, [field.key]: "" }));
                  }}
                />
              ))}
            {config.entries
              .filter((entry) => entry.showOnSuccess && entry.value)
              .map((entry) => (
                <div
                  key={entry.key}
                  className="MerchantInstagramAppSettings__callback"
                >
                  <strong>{entry.displayName}</strong>
                  <div>{entry.value}</div>
                </div>
              ))}
            <Flex justify="flex-end" gap="0.75rem">
              <Button
                type="button"
                classes={[ButtonClass.OUTLINED]}
                disabled={saving}
                onClick={close}
              >
                Done
              </Button>
              <Button
                type="submit"
                classes={[ButtonClass.SOLID]}
                loading={saving}
                disabled={saving || !supported}
              >
                Save app settings
              </Button>
            </Flex>
          </Content>
        </Modal>
      )}
    </>
  );
}
