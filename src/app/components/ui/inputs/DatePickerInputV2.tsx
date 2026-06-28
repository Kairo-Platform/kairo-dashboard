import React, { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.min.css";
import calendarIcon from "./icons/datepicker/icon-calendar.svg";
import caretDownIcon from "./icons/datepicker/caret-down.svg";
import Flex from "../Flex";
import Button, { ButtonClass, ButtonSize } from "../Button";

const DatePickerInputV2Container = styled.div`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.inputBorder};
  border-radius: 4px;
  padding: 4px 14px 10px 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  max-height: 4rem;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
  }

  label {
    display: inline-block;
    font-size: small;
    color: ${(props) => props.theme.colors.text_07};
    margin: 2px 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .required-mark {
    color: ${(props) => props.theme.colors.red};
  }

  input {
    display: block;
    width: 100%;
    font-size: 1rem;
    border: none;
    outline: none;
    color: ${(props) => props.theme.colors.text_02};
    padding: 0;
    height: 20px;

    &::placeholder {
      color: ${(props) => props.theme.colors.text_07};
    }
  }

  .react-datepicker,
  .react-datepicker-wrapper,
  .react-datepicker-wrapper input,
  .react-datepicker__input-container input {
    width: 100%;
    font-family: Satoshi, Arial, sans-serif;
  }

  .react-datepicker,
  .react-datepicker-popper {
    top: 2px;
    left: 143px;
  }

  .react-datepicker__month-dropdown,
  .react-datepicker__year-dropdown,
  .react-datepicker {
    box-shadow:
      0 0 0 1px hsl(0deg 0% 0% / 10%),
      0 4px 11px hsl(0deg 0% 0% / 10%);
  }

  .react-datepicker,
  .react-datepicker__header {
    border: 0;
    border-radius: 0;
  }

  .react-datepicker__month-dropdown,
  .react-datepicker__year-dropdown {
    border: 0;
    border-radius: 0;
  }

  .react-datepicker__year-option:first-of-type,
  .react-datepicker__month-option:first-of-type,
  .react-datepicker__month-year-option:first-of-type {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .react-datepicker__year-option:last-of-type,
  .react-datepicker__month-option:last-of-type,
  .react-datepicker__month-year-option:last-of-type {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-datepicker__year-option:hover,
  .react-datepicker__month-option:hover,
  .react-datepicker__month-year-option:hover {
    background-color: gainsboro;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: ${(props) => props.theme.colors.primaryColor}BB;
  }

  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end,
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: ${(props) => props.theme.colors.primaryColor};
  }

  .react-datepicker__day--selected:hover,
  .react-datepicker__day--in-selecting-range:hover,
  .react-datepicker__day--in-range:hover,
  .react-datepicker__month-text--selected:hover,
  .react-datepicker__month-text--in-selecting-range:hover,
  .react-datepicker__month-text--in-range:hover,
  .react-datepicker__quarter-text--selected:hover,
  .react-datepicker__quarter-text--in-selecting-range:hover,
  .react-datepicker__quarter-text--in-range:hover,
  .react-datepicker__year-text--selected:hover,
  .react-datepicker__year-text--in-selecting-range:hover,
  .react-datepicker__year-text--in-range:hover,
  .react-datepicker__day--keyboard-selected:hover,
  .react-datepicker__month-text--keyboard-selected:hover,
  .react-datepicker__quarter-text--keyboard-selected:hover,
  .react-datepicker__year-text--keyboard-selected:hover {
    background-color: ${(props) => props.theme.colors.primaryColor}BB;
  }

  .react-datepicker__navigation {
    width: 28px;
    height: 28px;
    padding-bottom: 4px;
  }
  .react-datepicker__navigation--previous {
    left: 8px;
  }
  .react-datepicker__navigation--next {
    right: 8px;
  }

  .react-datepicker__navigation-icon::before,
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow {
    top: 10px;
    width: 8px;
    height: 8px;
    border-color: silver;
  }

  .react-datepicker__navigation:hover *::before {
    border-color: dimgrey;
  }

  .react-datepicker__close-icon {
    padding: 0 2px;
    top: 0;
    right: 26px;
  }

  .react-datepicker__close-icon:after {
    background-color: transparent;
    color: silver;
    width: 20px;
    height: 20px;
    font-size: 24px;
    line-height: 24px;
    display: block;
    margin-top: -4px;
  }

  .react-datepicker__close-icon:focus:after,
  .react-datepicker__close-icon:hover:after {
    color: dimgrey;
  }

  .react-datepicker__input-container:after {
    content: "";
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 20px;
    background-image: url("${calendarIcon}");
    background-size: 0.8rem;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 6px 0 4px;
    cursor: pointer;
  }

  .react-datepicker__header__dropdown {
    position: absolute;
    top: 7px;
    width: 100%;
  }

  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__year-read-view--down-arrow {
    display: none;
  }
  .react-datepicker__month-read-view--selected-month,
  .react-datepicker__year-read-view--selected-year {
    font-weight: bold;
    font-size: 0.944rem;
    opacity: 0;
  }

  .react-datepicker__navigation--years-upcoming {
    top: 0;
    &:before {
      content: "" !important;
      background-image: url("${caretDownIcon}") !important;
      background-size: 0.8rem;
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      height: 100%;
      display: block;
      transform: rotate(180deg);
    }
  }

  .react-datepicker__navigation--years-previous {
    bottom: 0;
    &:before {
      content: "" !important;
      background-image: url("${caretDownIcon}") !important;
      background-size: 0.8rem;
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }

  .date_picker_quick_actions {
    position: absolute;
    left: 0;
    width: 160px;
    background: ${(props) => props.theme.colors.white};
    border: 0.1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 4px;
    padding: 10px;
    box-shadow:
      0 0 0 1px hsl(0deg 0% 0% / 10%),
      0 4px 11px hsl(0deg 0% 0% / 10%);
    z-index: 1001;
    inset: 0px auto auto 0px;
    transform: translate3d(0px, 43.6px, 0px);
    display: none;
    flex-direction: column;
    gap: 0.2rem;
    pointer-events: auto;
  }

  &.show-quick-actions .date_picker_quick_actions {
    display: flex;
  }

  .date_picker_quick_action_button {
    width: 100% !important;
    padding-block: 0rem !important;
    font-weight: 500 !important;
    align-items: start !important;
    color: ${(props) => props.theme.colors.text_02} !important;

    &:hover {
      color: ${(props) => props.theme.colors.primaryColor} !important;
      background-color: ${(props) =>
        props.theme.colors.primaryColor}11 !important;
    }

    &:active,
    &:focus,
    &.active {
      color: ${(props) => props.theme.colors.primaryColor} !important;
      background-color: ${(props) =>
        props.theme.colors.primaryColor}22 !important;
    }
  }

  .date_picker_calendar {
    width: 100%;
  }

  @media (max-width: 548px) {
    .date_picker_quick_actions {
      width: 100px;
      padding: 0.5rem;
    }

    .date_picker_quick_action_button {
      padding-inline: 0.3rem !important;
      font-size: 0.7rem !important;
      flex-wrap: wrap;
      text-align: left !important;
      overflow: hidden;
    }

    .react-datepicker,
    .react-datepicker-popper {
      left: 85px;
    }
  }

  .spacer {
    height: 4px;
  }
`;

interface DatePickerInputV2Props {
  label?: React.ReactNode;
  value?: Date | [Date | null, Date | null] | null;
  required?: boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  width?: string | number;
  disabled?: boolean;
  showSideBarQuickActions?: boolean;
  selectsRange?: boolean;
}

export const DatePickerInputV2: React.FC<DatePickerInputV2Props> = (props) => {
  const {
    label,
    value,
    required,
    onChange,
    placeholder,
    width,
    disabled,
    showSideBarQuickActions = false,
    selectsRange,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(
    null,
  );

  // Set Today as default
  useEffect(() => {
    if (!value && !activeQuickAction) {
      setActiveQuickAction("Today");
      if (selectsRange) {
        onChange([getToday(), getToday()]);
      } else {
        onChange(getToday());
      }
    }
  }, []);

  const adjustForTimezone = (
    date: Date | string | null | undefined,
  ): Date | null => {
    if (!date) return null;
    const d = new Date(date as any);
    if (isNaN(d.getTime())) return null;
    if (d.getTimezoneOffset() > 0) {
      return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    }
    if (d.getTimezoneOffset() < 0) {
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    }
    return d;
  };

  const getToday = (): Date | null => {
    const date = new Date();
    return adjustForTimezone(date);
  };

  const getYesterday = (): Date | null => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return adjustForTimezone(date);
  };

  const getThisWeekStart = (): Date | null => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return adjustForTimezone(date);
  };

  const getLastWeekStart = (): Date | null => {
    const start = getThisWeekStart();
    if (!start) return null;
    const date = new Date(start);
    date.setDate(date.getDate() - 7);
    return adjustForTimezone(date);
  };

  const getLastWeekEnd = (): Date | null => {
    const start = getThisWeekStart();
    if (!start) return null;
    const date = new Date(start);
    date.setDate(date.getDate() - 1);
    return adjustForTimezone(date);
  };

  const getDaysAgo = (days: number): Date | null => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return adjustForTimezone(date);
  };

  const getMonthsAgo = (months: number): Date | null => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return adjustForTimezone(date);
  };

  const getLastCalendarYearStart = (): Date | null => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1, 0, 1);
    return adjustForTimezone(date);
  };

  const getLastCalendarYearEnd = (): Date | null => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1, 11, 31);
    return adjustForTimezone(date);
  };

  const getThisYearStart = (): Date | null => {
    const date = new Date();
    date.setMonth(0, 1);
    return adjustForTimezone(date);
  };

  const handleQuickAction = (
    startDate: Date | null,
    endDate: Date | null = null,
    buttonLabel: string | null = null,
  ) => {
    flushSync(() => {
      setActiveQuickAction(buttonLabel);
    });

    requestAnimationFrame(() => {
      if (selectsRange) {
        if (endDate) {
          onChange([startDate, endDate]);
        } else {
          onChange([startDate, startDate]);
        }
      } else {
        onChange(startDate);
      }
    });
  };

  const handleDatePickerChange = (
    date: Date | [Date | null, Date | null] | null,
  ) => {
    onChange(date);
    setActiveQuickAction(null);
    setIsOpen(false);
  };

  const handleDatePickerOpen = () => {
    setIsOpen(true);
  };

  const handleDatePickerClose = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const quickActionButtons = [
    {
      label: "Today",
      action: () => {
        handleQuickAction(getToday(), null, "Today");
      },
    },
    {
      label: "Yesterday",
      action: () => {
        handleQuickAction(getYesterday(), null, "Yesterday");
      },
    },
    {
      label: "This week",
      action: () => {
        handleQuickAction(getThisWeekStart(), getToday(), "This week");
      },
    },
    {
      label: "Last week",
      action: () => {
        handleQuickAction(getLastWeekStart(), getLastWeekEnd(), "Last week");
      },
    },
    {
      label: "Last 14 days",
      action: () => {
        handleQuickAction(getDaysAgo(14), getToday(), "Last 14 days");
      },
    },
    {
      label: "Last 28 days",
      action: () => {
        handleQuickAction(getDaysAgo(28), getToday(), "Last 28 days");
      },
    },
    {
      label: "Last 90 days",
      action: () => {
        handleQuickAction(getDaysAgo(90), getToday(), "Last 90 days");
      },
    },
    {
      label: "Last 12 months",
      action: () => {
        handleQuickAction(getMonthsAgo(12), getToday(), "Last 12 months");
      },
    },
    {
      label: "Last calendar year",
      action: () => {
        handleQuickAction(
          getLastCalendarYearStart(),
          getLastCalendarYearEnd(),
          "Last calendar year",
        );
      },
    },
    {
      label: "This year (Jan - Today)",
      action: () => {
        handleQuickAction(
          getThisYearStart(),
          getToday(),
          "This year (Jan - Today)",
        );
      },
    },
    // {
    //   label: 'Custom',
    //   action: () => {
    //     setActiveQuickAction('Custom')
    //     if (props.selectsRange) {
    //       onChange([null, null])
    //     } else {
    //       onChange(null)
    //     }
    //   },
    // },
  ];

  return (
    <DatePickerInputV2Container
      style={{ width }}
      data-disabled={disabled}
      className={showSideBarQuickActions && isOpen ? "show-quick-actions" : ""}
      ref={containerRef}
    >
      {label ? (
        <label>
          {label} {required && <span className="required-mark">*</span>}
        </label>
      ) : (
        <div className="spacer" />
      )}
      <Flex
        style={{ width: "100%", paddingTop: "0.2rem" }}
        className="date_picker_container_flex"
      >
        {showSideBarQuickActions && isOpen && (
          <Flex
            className="date_picker_quick_actions"
            direction="column"
            gap="0.2rem"
            style={{ top: label ? "1.5rem" : "0" }}
          >
            {quickActionButtons.map((button, index) => {
              const isActive = activeQuickAction === button.label;
              const handleInteraction = (e: React.SyntheticEvent) => {
                e.stopPropagation();
                e.preventDefault();
                button.action();
              };

              return (
                <Button
                  key={index}
                  className={`date_picker_quick_action_button ${isActive ? "active" : ""}`}
                  classes={[ButtonClass.QUICK_ACTION_BUTTON] as any}
                  size={ButtonSize.SMALL}
                  onClick={handleInteraction as any}
                  onMouseDown={handleInteraction as any}
                  onTouchStart={handleInteraction as any}
                  containerStyle={{}}
                  style={{}}
                >
                  {button.label}
                </Button>
              );
            })}
          </Flex>
        )}
        <div className="date_picker_calendar">
          <DatePicker
            showPopperArrow={false}
            dateFormat="dd MMM Y"
            autoComplete="off"
            selected={
              !selectsRange ? (value as Date | null | undefined) : undefined
            }
            onChange={handleDatePickerChange}
            onCalendarOpen={handleDatePickerOpen}
            onCalendarClose={handleDatePickerClose}
            placeholderText={placeholder}
            isClearable
            showMonthDropdown
            showYearDropdown
            {...(selectsRange
              ? {
                  selectsRange: true as const,
                  startDate: Array.isArray(value)
                    ? (value[0] as Date | null)
                    : null,
                  endDate: Array.isArray(value)
                    ? (value[1] as Date | null)
                    : null,
                }
              : {})}
            {...(rest as any)}
          />
        </div>
      </Flex>
    </DatePickerInputV2Container>
  );
};

export default DatePickerInputV2;
