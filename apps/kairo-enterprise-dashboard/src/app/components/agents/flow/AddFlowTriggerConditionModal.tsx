"use client";

import type {
  ConditionRowState,
  FlowTriggerCondition,
  LogicalOperator,
} from "@/services/Flow/types";
import { Icon } from "@iconify/react";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Flex,
  Loading,
  Modal,
} from "@kairo/ui";
import {
  DatePickerInput,
  FormInput,
  SelectInput,
  SwitchInput,
} from "@kairo/ui/inputs";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchFlowTriggerConditions, flowStore } from "@/app/store/flow";
import { useEntity } from "simpler-state";
import styled from "styled-components";
import { DURATION_UNITS } from "./resources";

const AddFlowTriggerConditionModalContainer = styled.div`
  .ConditionRow {
    position: relative;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.ui_07};
  }

  .ConditionRow__field {
    flex: 1 1 calc(33.333% - 0.67rem);
    min-width: 160px;
  }

  .ConditionRow__value-extra {
    flex: 1 1 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.25rem;
  }

  .ConditionRow__value-extra > * {
    flex: 1 1 calc(33.333% - 0.67rem);
    min-width: 140px;
  }

  .ConditionRow__value-extra[data-count="2"] > * {
    flex: 1 1 calc(50% - 0.5rem);
  }

  .ConditionRow__value-extra[data-count="1"] > * {
    flex: 1 1 100%;
  }

  .ConditionRow__delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.text_07};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${({ theme }) => theme.colors.gray_02};
      color: ${({ theme }) => theme.colors.red};
    }
  }

  .Connector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.5rem 0;

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: ${({ theme }) => theme.colors.inputBorder};
    }

    span {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: ${({ theme }) => theme.colors.text_07};
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      background: ${({ theme }) => theme.colors.ui_07};
      border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    }
  }
`;

const createEmptyRow = (): ConditionRowState => ({
  id: crypto.randomUUID(),
  conditionType: null,
  conditionOperator: null,
  value: null,
  errors: {},
});

function getOperatorConfig(
  catalog: any[],
  conditionType: string | null,
  conditionOperator: string | null,
) {
  if (!conditionType || !conditionOperator) return null;
  const condition = catalog.find((c) => c.value === conditionType);
  return (
    condition?.operators?.find((o: any) => o.value === conditionOperator) ??
    null
  );
}

function normalizeValueForPayload(
  row: ConditionRowState,
  operatorConfig: any,
): any {
  if (!operatorConfig) return row.value;

  const input = operatorConfig.input;

  // Boolean
  if (input === "BOOLEAN") {
    if (typeof row.value === "boolean") return row.value;
    return row.value === "TRUE" || row.value === true;
  }

  // Simple SELECT / PRESET without extra input
  if (input === "SELECT" || input === "PRESET_NUMBER") {
    if (
      typeof row.value === "object" &&
      row.value?.preset &&
      (row.value.preset === "IN_DAYS" || row.value.preset === "DAYS_AGO")
    ) {
      return {
        preset: row.value.preset,
        amount: Number(row.value.amount),
      };
    }
    if (typeof row.value === "string" && operatorConfig.values?.length) {
      return { preset: row.value };
    }
    return row.value;
  }

  // Ranges
  if (
    input === "DATE_RANGE" ||
    input === "TIME_RANGE" ||
    input === "NUMBER" ||
    input === "CURRENCY"
  ) {
    if (operatorConfig.value === "BETWEEN" || input.includes("RANGE")) {
      return {
        from: row.value?.from,
        to: row.value?.to,
      };
    }
  }

  // Relative duration
  if (input === "RELATIVE_DURATION") {
    if (operatorConfig.value === "BETWEEN") {
      return {
        from: {
          amount: Number(row.value?.from?.amount),
          unit: row.value?.from?.unit,
        },
        to: {
          amount: Number(row.value?.to?.amount),
          unit: row.value?.to?.unit,
        },
      };
    }
    return {
      amount: Number(row.value?.amount),
      unit: row.value?.unit,
    };
  }

  // Default (NUMBER, CURRENCY, DATE, TIME …)
  return row.value;
}

function buildConditionTree(
  rows: ConditionRowState[],
  connectors: LogicalOperator[],
  catalog: any[],
): FlowTriggerCondition {
  const toLeaf = (row: ConditionRowState): FlowTriggerCondition => {
    const opConfig = getOperatorConfig(
      catalog,
      row.conditionType,
      row.conditionOperator,
    );
    return {
      kind: "CONDITION",
      conditionType: row.conditionType!,
      conditionOperator: row.conditionOperator!,
      value: normalizeValueForPayload(row, opConfig),
      children: [],
    };
  };

  if (rows.length === 1) {
    return toLeaf(rows[0]);
  }

  // Left-associative folding that merges consecutive same operators into one GROUP
  let current: FlowTriggerCondition = toLeaf(rows[0]);

  for (let i = 0; i < connectors.length; i++) {
    const next = toLeaf(rows[i + 1]);
    const op = connectors[i];

    if (current.kind === "GROUP" && current.operator === op) {
      current = {
        ...current,
        children: [...current.children, next],
      };
    } else {
      current = {
        kind: "GROUP",
        operator: op,
        children: [current, next],
      };
    }
  }

  return current;
}

export const AddFlowTriggerConditionModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (condition: FlowTriggerCondition) => void;
}) => {
  const { flowTriggerConditions, fetchingFlowTriggerConditions } =
    useEntity(flowStore);

  const [rows, setRows] = useState<ConditionRowState[]>([createEmptyRow()]);
  const [connectors, setConnectors] = useState<LogicalOperator[]>([]);

  const fetchedConditionsRef = useRef(false);
  useEffect(() => {
    if (fetchedConditionsRef.current) return;
    fetchedConditionsRef.current = true;
    fetchFlowTriggerConditions();
  }, []);

  const conditionOptions = useMemo(
    () =>
      (flowTriggerConditions || []).map((c: any) => ({
        value: c.value,
        label: c.label,
      })),
    [flowTriggerConditions],
  );

  const updateRow = (id: string, patch: Partial<ConditionRowState>) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...patch, errors: { ...r.errors, ...patch.errors } }
          : r,
      ),
    );
  };

  const handleConditionTypeChange = (id: string, value: string) => {
    updateRow(id, {
      conditionType: value,
      conditionOperator: null,
      value: null,
      errors: {},
    });
  };

  const handleOperatorChange = (id: string, value: string) => {
    updateRow(id, {
      conditionOperator: value,
      value: null,
      errors: {},
    });
  };

  const handleAddConditionRow = (type: LogicalOperator) => {
    setRows((prev) => [...prev, createEmptyRow()]);
    setConnectors((prev) => [...prev, type]);
  };

  const handleDeleteRow = (id: string, index: number) => {
    if (index === 0) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    setConnectors((prev) => {
      const next = [...prev];
      next.splice(index - 1, 1);
      return next;
    });
  };

  const validate = (): boolean => {
    let isValid = true;
    const nextRows = rows.map((row) => {
      const errors: ConditionRowState["errors"] = {};
      const opConfig = getOperatorConfig(
        flowTriggerConditions || [],
        row.conditionType,
        row.conditionOperator,
      );

      if (!row.conditionType) {
        errors.conditionType = "Condition is required";
        isValid = false;
      }
      if (!row.conditionOperator) {
        errors.conditionOperator = "Operator is required";
        isValid = false;
      }

      if (opConfig) {
        const input = opConfig.input;

        if (input === "BOOLEAN") {
          if (row.value === null || row.value === undefined) {
            errors.value = "Value is required";
            isValid = false;
          }
        } else if (input === "SELECT" || input === "PRESET_NUMBER") {
          if (
            !row.value ||
            (typeof row.value === "object" && !row.value.preset)
          ) {
            errors.value = "Value is required";
            isValid = false;
          }
          if (
            typeof row.value === "object" &&
            (row.value.preset === "IN_DAYS" ||
              row.value.preset === "DAYS_AGO") &&
            (row.value.amount === undefined || row.value.amount === "")
          ) {
            errors.amount = "Number of days is required";
            isValid = false;
          }
        } else if (
          input === "DATE_RANGE" ||
          input === "TIME_RANGE" ||
          (opConfig.value === "BETWEEN" &&
            (input === "NUMBER" || input === "CURRENCY"))
        ) {
          if (row.value?.from === undefined || row.value?.from === "") {
            errors.from = "From value is required";
            isValid = false;
          }
          if (row.value?.to === undefined || row.value?.to === "") {
            errors.to = "To value is required";
            isValid = false;
          }
        } else if (input === "RELATIVE_DURATION") {
          if (opConfig.value === "BETWEEN") {
            if (!row.value?.from?.amount) {
              errors.from = "From amount is required";
              isValid = false;
            }
            if (!row.value?.from?.unit) {
              errors.unit = "From unit is required";
              isValid = false;
            }
            if (!row.value?.to?.amount) {
              errors.to = "To amount is required";
              isValid = false;
            }
          } else {
            if (!row.value?.amount) {
              errors.amount = "Duration is required";
              isValid = false;
            }
            if (!row.value?.unit) {
              errors.unit = "Unit is required";
              isValid = false;
            }
          }
        } else {
          // NUMBER, CURRENCY, DATE, TIME …
          if (
            row.value === null ||
            row.value === undefined ||
            row.value === ""
          ) {
            errors.value = "Value is required";
            isValid = false;
          }
        }
      }

      return { ...row, errors };
    });

    setRows(nextRows);
    return isValid;
  };

  const handleAddTriggerCondition = () => {
    if (!validate()) return;

    const tree = buildConditionTree(
      rows,
      connectors,
      flowTriggerConditions || [],
    );
    onSuccess(tree);
    onClose();
  };

  const renderValueInput = (row: ConditionRowState) => {
    const opConfig = getOperatorConfig(
      flowTriggerConditions || [],
      row.conditionType,
      row.conditionOperator,
    );
    if (!opConfig) return null;

    const input = opConfig.input;
    const values = opConfig.values || [];

    // BOOLEAN
    if (input === "BOOLEAN") {
      return (
        <SwitchInput
          label="True"
          value={!!row.value}
          onChange={(checked) => updateRow(row.id, { value: checked })}
        />
      );
    }

    // SELECT / PRESET
    if (input === "SELECT" || input === "PRESET_NUMBER") {
      const selectedPreset =
        typeof row.value === "object" ? row.value?.preset : row.value;
      const needsNumber =
        selectedPreset === "IN_DAYS" || selectedPreset === "DAYS_AGO";

      if (needsNumber) {
        return (
          <div className="ConditionRow__value-extra" data-count="2">
            <SelectInput
              label="Value"
              options={values.map((v: any) => ({
                value: v.value,
                label: v.label,
              }))}
              value={selectedPreset || ""}
              onChange={(val: any) => {
                const meta = values.find((v: any) => v.value === val);
                if (meta?.input === "NUMBER") {
                  updateRow(row.id, { value: { preset: val, amount: "" } });
                } else {
                  updateRow(row.id, { value: val });
                }
              }}
              placeholder="Select value"
              required
              message={
                row.errors.value
                  ? { type: "error", content: row.errors.value }
                  : undefined
              }
            />
            <FormInput
              label="Number of days"
              type="number"
              placeholder="e.g. 3"
              value={row.value?.amount ?? ""}
              onChange={(e) =>
                updateRow(row.id, {
                  value: { ...row.value, amount: e.target.value },
                })
              }
              required
              message={
                row.errors.amount
                  ? { type: "error", content: row.errors.amount }
                  : undefined
              }
            />
          </div>
        );
      }

      return (
        <div className="ConditionRow__field">
          <SelectInput
            label="Value"
            options={values.map((v: any) => ({
              value: v.value,
              label: v.label,
            }))}
            value={selectedPreset || ""}
            onChange={(val: any) => {
              const meta = values.find((v: any) => v.value === val);
              if (meta?.input === "NUMBER") {
                updateRow(row.id, { value: { preset: val, amount: "" } });
              } else {
                updateRow(row.id, { value: val });
              }
            }}
            placeholder="Select value"
            required
            message={
              row.errors.value
                ? { type: "error", content: row.errors.value }
                : undefined
            }
          />
        </div>
      );
    }

    // BETWEEN / RANGES
    if (
      input === "DATE_RANGE" ||
      input === "TIME_RANGE" ||
      (opConfig.value === "BETWEEN" &&
        (input === "NUMBER" || input === "CURRENCY"))
    ) {
      const isDate = input === "DATE_RANGE";
      const isTime = input === "TIME_RANGE";
      const isCurrency = input === "CURRENCY";

      return (
        <div className="ConditionRow__value-extra" data-count="2">
          {isDate ? (
            <>
              <DatePickerInput
                label="From"
                placeholder="Start date"
                value={row.value?.from || ""}
                onChange={(val) =>
                  updateRow(row.id, { value: { ...row.value, from: val } })
                }
                required
                message={
                  row.errors.from
                    ? { type: "error", content: row.errors.from }
                    : undefined
                }
                style={{ maxHeight: "unset" }}
              />
              <DatePickerInput
                label="To"
                placeholder="End date"
                value={row.value?.to || ""}
                onChange={(val) =>
                  updateRow(row.id, { value: { ...row.value, to: val } })
                }
                required
                message={
                  row.errors.to
                    ? { type: "error", content: row.errors.to }
                    : undefined
                }
                style={{ maxHeight: "unset" }}
              />
            </>
          ) : (
            <>
              <FormInput
                label="From"
                type={isTime ? "time" : "number"}
                placeholder={isTime ? "HH:mm" : "From"}
                showFlag={isCurrency}
                value={row.value?.from ?? ""}
                onChange={(e) =>
                  updateRow(row.id, {
                    value: { ...row.value, from: e.target.value },
                  })
                }
                required
                message={
                  row.errors.from
                    ? { type: "error", content: row.errors.from }
                    : undefined
                }
              />
              <FormInput
                label="To"
                type={isTime ? "time" : "number"}
                placeholder={isTime ? "HH:mm" : "To"}
                showFlag={isCurrency}
                value={row.value?.to ?? ""}
                onChange={(e) =>
                  updateRow(row.id, {
                    value: { ...row.value, to: e.target.value },
                  })
                }
                required
                message={
                  row.errors.to
                    ? { type: "error", content: row.errors.to }
                    : undefined
                }
              />
            </>
          )}
        </div>
      );
    }

    // RELATIVE_DURATION
    if (input === "RELATIVE_DURATION") {
      if (opConfig.value === "BETWEEN") {
        return (
          <div className="ConditionRow__value-extra" data-count="2">
            <Flex gap="0.5rem" style={{ flex: 1 }}>
              <FormInput
                label="From amount"
                type="number"
                placeholder="e.g. 7"
                value={row.value?.from?.amount ?? ""}
                onChange={(e) =>
                  updateRow(row.id, {
                    value: {
                      ...row.value,
                      from: { ...row.value?.from, amount: e.target.value },
                    },
                  })
                }
                required
                message={
                  row.errors.from
                    ? { type: "error", content: row.errors.from }
                    : undefined
                }
              />
              <SelectInput
                label="Unit"
                options={DURATION_UNITS}
                value={row.value?.from?.unit || ""}
                onChange={(val: any) =>
                  updateRow(row.id, {
                    value: {
                      ...row.value,
                      from: { ...row.value?.from, unit: val },
                    },
                  })
                }
                placeholder="Unit"
                required
              />
            </Flex>
            <Flex gap="0.5rem" style={{ flex: 1 }}>
              <FormInput
                label="To amount"
                type="number"
                placeholder="e.g. 30"
                value={row.value?.to?.amount ?? ""}
                onChange={(e) =>
                  updateRow(row.id, {
                    value: {
                      ...row.value,
                      to: { ...row.value?.to, amount: e.target.value },
                    },
                  })
                }
                required
                message={
                  row.errors.to
                    ? { type: "error", content: row.errors.to }
                    : undefined
                }
              />
              <SelectInput
                label="Unit"
                options={DURATION_UNITS}
                value={row.value?.to?.unit || ""}
                onChange={(val: any) =>
                  updateRow(row.id, {
                    value: {
                      ...row.value,
                      to: { ...row.value?.to, unit: val },
                    },
                  })
                }
                placeholder="Unit"
                required
              />
            </Flex>
          </div>
        );
      }

      // single duration → 2 columns on the second row
      return (
        <div className="ConditionRow__value-extra" data-count="2">
          <FormInput
            label="Duration"
            type="number"
            placeholder="e.g. 30"
            value={row.value?.amount ?? ""}
            onChange={(e) =>
              updateRow(row.id, {
                value: { ...row.value, amount: e.target.value },
              })
            }
            required
            message={
              row.errors.amount
                ? { type: "error", content: row.errors.amount }
                : undefined
            }
          />
          <SelectInput
            label="Unit"
            options={DURATION_UNITS}
            value={row.value?.unit || ""}
            onChange={(val: any) =>
              updateRow(row.id, { value: { ...row.value, unit: val } })
            }
            placeholder="Select unit"
            required
            message={
              row.errors.unit
                ? { type: "error", content: row.errors.unit }
                : undefined
            }
          />
        </div>
      );
    }

    // DATE
    if (input === "DATE") {
      return (
        <div className="ConditionRow__field">
          <DatePickerInput
            label="Value"
            placeholder="Select date"
            value={row.value || ""}
            onChange={(val) => updateRow(row.id, { value: val })}
            required
            message={
              row.errors.value
                ? { type: "error", content: row.errors.value }
                : undefined
            }
            style={{ maxHeight: "unset" }}
          />
        </div>
      );
    }

    // TIME
    if (input === "TIME") {
      return (
        <div className="ConditionRow__field">
          <FormInput
            label="Value"
            type="time"
            placeholder="HH:mm"
            value={row.value || ""}
            onChange={(e) => updateRow(row.id, { value: e.target.value })}
            required
            message={
              row.errors.value
                ? { type: "error", content: row.errors.value }
                : undefined
            }
          />
        </div>
      );
    }

    // NUMBER / CURRENCY (default)
    const isCurrency = input === "CURRENCY";
    return (
      <div className="ConditionRow__field">
        <FormInput
          label="Value"
          type="number"
          placeholder={isCurrency ? "Amount" : "Enter value"}
          showFlag={isCurrency}
          value={row.value ?? ""}
          onChange={(e) => updateRow(row.id, { value: e.target.value })}
          required
          message={
            row.errors.value
              ? { type: "error", content: row.errors.value }
              : undefined
          }
        />
      </div>
    );
  };

  return (
    <AddFlowTriggerConditionModalContainer>
      <Modal
        title="Add trigger condition"
        onClose={onClose}
        Footer={() => (
          <Flex
            gap="0.75rem"
            align="center"
            justify="flex-end"
            style={{ marginTop: "1rem" }}
          >
            <Button
              classes={[ButtonClass.OUTLINED]}
              size={ButtonSize.WIDTH_140}
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.WIDTH_140}
              type="button"
              onClick={handleAddTriggerCondition}
            >
              Add
            </Button>
          </Flex>
        )}
      >
        {fetchingFlowTriggerConditions ? (
          <Flex align="center" justify="center" style={{ height: "10rem" }}>
            <Loading>Fetching conditions...</Loading>
          </Flex>
        ) : (
          <Flex
            direction="column"
            gap="0.5rem"
            style={{ marginBottom: "5rem" }}
          >
            {rows.map((row, index) => {
              const selectedCondition = (flowTriggerConditions || []).find(
                (c: any) => c.value === row.conditionType,
              );
              const operatorOptions =
                selectedCondition?.operators?.map((o: any) => ({
                  value: o.value,
                  label: o.label,
                })) || [];

              return (
                <div key={row.id}>
                  {index > 0 && (
                    <div className="Connector">
                      <span>{connectors[index - 1]}</span>
                    </div>
                  )}

                  <Flex
                    align="center"
                    gap="1rem"
                    className="ConditionRow"
                    style={{ flexWrap: "wrap" }}
                  >
                    <SelectInput
                      className="ConditionRow__field"
                      label="Condition (if)"
                      options={conditionOptions}
                      value={row.conditionType || ""}
                      onChange={(val: any) =>
                        handleConditionTypeChange(row.id, val)
                      }
                      placeholder="Select condition"
                      required
                      message={
                        row.errors.conditionType
                          ? { type: "error", content: row.errors.conditionType }
                          : undefined
                      }
                    />

                    <SelectInput
                      className="ConditionRow__field"
                      label="Operator"
                      options={operatorOptions}
                      value={row.conditionOperator || ""}
                      onChange={(val: any) => handleOperatorChange(row.id, val)}
                      placeholder="Select operator"
                      required
                      disabled={!row.conditionType}
                      message={
                        row.errors.conditionOperator
                          ? {
                              type: "error",
                              content: row.errors.conditionOperator,
                            }
                          : undefined
                      }
                    />

                    {renderValueInput(row)}

                    {index > 0 && (
                      <Button
                        classes={[
                          ButtonClass.OUTLINED_RED,
                          ButtonClass.ICON_ONLY,
                        ]}
                        className="ConditionRow__delete"
                        onClick={() => handleDeleteRow(row.id, index)}
                        aria-label="Delete condition"
                      >
                        <Icon icon="ic:round-close" width={18} height={18} />
                      </Button>
                    )}
                  </Flex>
                </div>
              );
            })}

            <Flex align="center" gap="1rem" style={{ marginTop: "1.25rem" }}>
              <Button
                classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                style={{ height: "2rem" }}
                type="button"
                onClick={() => handleAddConditionRow("AND")}
              >
                <Icon icon="basil:plus-outline" width={16} height={16} />
                Add condition (AND)
              </Button>
              <Button
                classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                style={{ height: "2rem" }}
                type="button"
                onClick={() => handleAddConditionRow("OR")}
              >
                <Icon icon="basil:plus-outline" width={16} height={16} />
                Add condition (OR)
              </Button>
            </Flex>
          </Flex>
        )}
      </Modal>
    </AddFlowTriggerConditionModalContainer>
  );
};
