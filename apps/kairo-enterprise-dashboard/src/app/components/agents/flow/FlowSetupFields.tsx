"use client";

import {
  CheckboxInput,
  FormInput,
  SelectInput,
  SwitchInput,
  SwitchInputSize,
} from "@kairo/ui/inputs";
import {
  normalizeAutomationTime,
  toSelectOptions,
  type BackendSchemaField,
} from "@/services/Flow";

type FlowSetupFieldsProps = {
  fields: BackendSchemaField[];
  values: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
};

export function FlowSetupFields({
  fields,
  values,
  onFieldChange,
}: FlowSetupFieldsProps) {
  return fields.map((field) => {
    const value = values[field.field];
    const change = (next: unknown) => onFieldChange(field.field, next);

    switch (field.kind) {
      case "TOGGLE":
        return (
          <div key={field.field} className="FlowGeneralSettings__toggleRow">
            <span>{field.label}</span>
            <SwitchInput
              name={field.field}
              size={SwitchInputSize.SMALL}
              value={value === true}
              onChange={change}
            />
          </div>
        );
      case "SELECT":
        return (
          <SelectInput
            key={field.field}
            label={field.label}
            options={toSelectOptions(field.options, [])}
            value={String(value ?? "")}
            onChange={(next: string | { value: string }) =>
              change(typeof next === "object" ? next.value : next)
            }
          />
        );
      case "MULTI_SELECT": {
        const selected = Array.isArray(value) ? value.map(String) : [];
        const options = toSelectOptions(field.options, []);
        if (!options.length && field.allowsCustom) {
          return (
            <FormInput
              key={field.field}
              name={field.field}
              label={field.label}
              value={selected.join(", ")}
              placeholder="Enter values separated by commas"
              onChange={(event) =>
                change(
                  event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                )
              }
            />
          );
        }
        return (
          <div key={field.field} className="FlowGeneralSettings__languageCard">
            <div className="FlowGeneralSettings__languageCard-header">
              <span>{field.label}</span>
            </div>
            <CheckboxInput
              name={field.field}
              options={options}
              value={selected}
              onChange={change}
              direction="column"
            />
          </div>
        );
      }
      case "TIME":
        return (
          <FormInput
            key={field.field}
            name={field.field}
            label={field.label}
            type="time"
            step={60}
            value={String(value ?? "")}
            onChange={(event) => change(event.target.value)}
            onBlur={(event) =>
              change(normalizeAutomationTime(event.target.value))
            }
          />
        );
      case "TEXT":
      case "STRING":
        return (
          <FormInput
            key={field.field}
            name={field.field}
            label={field.label}
            value={String(value ?? "")}
            onChange={(event) => change(event.target.value)}
          />
        );
      case "NUMBER":
        return (
          <FormInput
            key={field.field}
            name={field.field}
            label={field.label}
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(event) =>
              change(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        );
      default:
        return null;
    }
  });
}
