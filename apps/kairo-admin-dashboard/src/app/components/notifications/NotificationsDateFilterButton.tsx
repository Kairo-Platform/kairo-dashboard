"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Button, ButtonClass, ButtonSize, Flex } from "@/app/components/ui";
import { DatePickerInput, FormInput } from "@/app/components/ui/inputs";

type NotificationsFilterValues = {
  startDate: Date | null;
  endDate: Date | null;
  page: number;
  limit: number;
};

type NotificationsDateFilterButtonProps = {
  values: NotificationsFilterValues;
  onApply: (values: NotificationsFilterValues) => void;
  onClear: () => void;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const NotificationsDateFilterButtonContainer = styled.div`
  .NotificationsFilterAction {
    position: absolute;
    top: 3.5rem;
    right: 0;
    z-index: 2;
    background: ${(props) => props.theme.colors.white};
    box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.08);
    border-radius: 1rem;
    padding: 1.5rem 1rem 1rem;
    max-width: 30rem;
    min-width: 20rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .NotificationsFilterGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }

  .NotificationsFilterActions {
    margin-top: 2rem;
  }

  .NotificationsFilterButton {
    min-width: ${ButtonSize.WIDTH_140};
  }

  @media (max-width: 478px) {
    .NotificationsFilterAction {
      left: 0;
      right: 0;
      max-width: 100vw;
    }

    .NotificationsFilterGrid {
      grid-template-columns: 1fr;
    }
  }
`;

const toNumberOrDefault = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
};

const isSameCalendarDay = (left: Date | null, right: Date | null) => {
  if (!left || !right) return false;

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const isTodayRange = (rangeStart: Date | null, rangeEnd: Date | null) => {
  const today = new Date();
  return (
    isSameCalendarDay(rangeStart, rangeEnd) &&
    isSameCalendarDay(rangeStart, today)
  );
};

export const NotificationsDateFilterButton: FC<
  NotificationsDateFilterButtonProps
> = ({ values, onApply, onClear }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState<Date | null>(
    values.startDate,
  );
  const [draftEndDate, setDraftEndDate] = useState<Date | null>(values.endDate);
  const [draftPage, setDraftPage] = useState(
    String(values.page || DEFAULT_PAGE),
  );
  const [draftLimit, setDraftLimit] = useState(
    String(values.limit || DEFAULT_LIMIT),
  );

  useEffect(() => {
    if (!showFilter) {
      setDraftStartDate(values.startDate);
      setDraftEndDate(values.endDate);
      setDraftPage(String(values.page || DEFAULT_PAGE));
      setDraftLimit(String(values.limit || DEFAULT_LIMIT));
    }
  }, [showFilter, values.endDate, values.limit, values.page, values.startDate]);

  const buttonLabel = useMemo(() => {
    const hasDateFilter = Boolean(values.startDate && values.endDate);
    const isDefaultPagination =
      values.page === DEFAULT_PAGE && values.limit === DEFAULT_LIMIT;

    if (isTodayRange(values.startDate, values.endDate) && isDefaultPagination) {
      return "Today";
    }

    if (hasDateFilter || !isDefaultPagination) return "Filtered";
    return "Filter";
  }, [values.endDate, values.limit, values.page, values.startDate]);

  const applyFilter = () => {
    const nextPage = toNumberOrDefault(draftPage, DEFAULT_PAGE);
    const nextLimit = toNumberOrDefault(draftLimit, DEFAULT_LIMIT);

    onApply({
      startDate: draftStartDate,
      endDate: draftEndDate,
      page: nextPage,
      limit: nextLimit,
    });

    setShowFilter(false);
  };

  const clearFilter = () => {
    setDraftStartDate(null);
    setDraftEndDate(null);
    setDraftPage(String(DEFAULT_PAGE));
    setDraftLimit(String(DEFAULT_LIMIT));
    onClear();
    setShowFilter(false);
  };

  return (
    <NotificationsDateFilterButtonContainer>
      <Flex
        className="NotificationsFilterRoot"
        style={{ position: "relative" }}
      >
        <Button
          classes={[
            ButtonClass.OUTLINED,
            ButtonClass.WITH_ICON,
            "NotificationsFilterButton",
          ]}
          style={{ height: "2rem" }}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {buttonLabel}
          <Icon icon="mi:chevron-down" width={16} height={16} />
        </Button>

        {showFilter && (
          <div className="NotificationsFilterAction">
            <div className="NotificationsFilterGrid">
              <DatePickerInput
                placeholder="Start date"
                value={draftStartDate ?? undefined}
                onChange={(val: any) => setDraftStartDate(val || null)}
              />
              <DatePickerInput
                placeholder="End date"
                value={draftEndDate ?? undefined}
                onChange={(val: any) => setDraftEndDate(val || null)}
              />
              <FormInput
                type="number"
                min={1}
                label="Page"
                value={draftPage}
                onChange={(event) => setDraftPage(event.target.value)}
              />
              <FormInput
                type="number"
                min={1}
                label="Limit"
                value={draftLimit}
                onChange={(event) => setDraftLimit(event.target.value)}
              />
            </div>

            <Flex justify="flex-end" className="NotificationsFilterActions">
              <Button
                type="button"
                classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
                style={{ height: "2rem" }}
                onClick={clearFilter}
              >
                Clear
              </Button>
              <Button
                type="button"
                classes={[ButtonClass.SOLID]}
                onClick={applyFilter}
                style={{ height: "2rem" }}
              >
                Apply filter
              </Button>
            </Flex>
          </div>
        )}
      </Flex>
    </NotificationsDateFilterButtonContainer>
  );
};

export default NotificationsDateFilterButton;
