"use client";

import { Icon } from "@iconify/react";
import { EmptyState } from "@kairo/ui";
import {
  CheckboxInput,
  FormInput,
  SelectInput,
  SwitchInput,
  SwitchInputSize,
} from "@kairo/ui/inputs";
import {
  toSelectOptions,
  type BackendSchemaField,
} from "@/services/Flow";

type FlowConversationAutomationFieldsProps = {
  fields: BackendSchemaField[];
  values: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
};

const handleSelectValue = (value: string | { value: string }): string =>
  value && typeof value === "object" && "value" in value
    ? String(value.value)
    : String(value ?? "");

const readMultiSelectValue = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

export function FlowConversationAutomationFields({
  fields,
  values,
  onFieldChange,
}: FlowConversationAutomationFieldsProps) {
  if (!fields.length) {
    return (
      <EmptyState
        title="No automation for this conversation type"
        message="This conversation type does not define automation in the schema."
      />
    );
  }

  return (
    <div className="FlowConversationSettings__automation">
      {fields.map((field) => {
        const fieldValue = values[field.field];

        if (field.kind === "TOGGLE") {
          return (
            <div
              key={field.field}
              className="FlowConversationSettings__automationCard"
            >
              <div className="FlowConversationSettings__automationCard-header">
                <span>{field.label}</span>
                <SwitchInput
                  size={SwitchInputSize.SMALL}
                  value={Boolean(fieldValue)}
                  onChange={(value) => onFieldChange(field.field, value)}
                  name={field.field}
                />
              </div>
            </div>
          );
        }

        if (field.kind === "SELECT") {
          const options = toSelectOptions(field.options, []);
          return (
            <div
              key={field.field}
              className="FlowConversationSettings__automationCard"
            >
              <div className="FlowConversationSettings__automationCard-fields">
                <SelectInput
                  label={field.label}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  options={options}
                  value={String(fieldValue ?? "")}
                  onChange={(val: string | { value: string }) =>
                    onFieldChange(field.field, handleSelectValue(val))
                  }
                />
              </div>
            </div>
          );
        }

        if (field.kind === "MULTI_SELECT") {
          const options = toSelectOptions(field.options, []);
          const selected = readMultiSelectValue(fieldValue);

          if (options.length > 0) {
            const allSelected = options.length > 0 && selected.length === options.length;
            return (
              <div
                key={field.field}
                className="FlowConversationSettings__checkboxCard"
              >
                <div className="FlowConversationSettings__checkboxCard-header">
                  <span>{field.label}</span>
                  <button
                    type="button"
                    className="FlowConversationSettings__checkboxCard-selectAll"
                    onClick={() =>
                      onFieldChange(
                        field.field,
                        allSelected ? [] : options.map((option) => option.value),
                      )
                    }
                  >
                    {allSelected ? "Clear" : "Select all"}
                  </button>
                </div>
                <CheckboxInput
                  name={field.field}
                  options={options}
                  value={selected}
                  onChange={(next) => onFieldChange(field.field, next)}
                  direction="column"
                />
              </div>
            );
          }

          if (field.allowsCustom) {
            return (
              <div
                key={field.field}
                className="FlowConversationSettings__automationCard"
              >
                <div className="FlowConversationSettings__automationCard-fields">
                  <FormInput
                    label={field.label}
                    name={field.field}
                    value={selected.join(", ")}
                    onChange={(event) =>
                      onFieldChange(
                        field.field,
                        event.target.value
                          .split(",")
                          .map((entry) => entry.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="Enter values separated by commas"
                  />
                </div>
              </div>
            );
          }

          return null;
        }

        if (field.kind === "TIME") {
          return (
            <div
              key={field.field}
              className="FlowConversationSettings__automationCard"
            >
              <div className="FlowConversationSettings__automationCard-fields">
                <FormInput
                  label={field.label}
                  name={field.field}
                  value={String(fieldValue ?? "")}
                  onChange={(event) =>
                    onFieldChange(field.field, event.target.value)
                  }
                  placeholder="e.g. 09:00"
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={field.field}
            className="FlowConversationSettings__automationCard"
          >
            <div className="FlowConversationSettings__automationHint">
              <Icon icon="si:warning-line" width={16} height={16} />
              Unsupported automation field: {field.field}
            </div>
          </div>
        );
      })}
    </div>
  );
}
