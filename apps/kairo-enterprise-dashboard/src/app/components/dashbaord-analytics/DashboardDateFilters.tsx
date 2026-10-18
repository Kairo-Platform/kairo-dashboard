"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { DatePickerInput } from "@/app/components/ui/inputs";
import { formatDate } from "@kairo/lib/utils";

const DateFiltersContainer = styled.div`
  position: relative;

  .FilterAction {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    z-index: 6;
    width: min(30rem, calc(100vw - 3rem));
    background: ${({ theme }) => theme.colors.ui_07};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border-radius: 1rem;
    padding: 1.5rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .FilterAction h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .FilterGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .FilterGrid > div {
    min-width: 0;
  }

  @media (max-width: 600px) {
    .FilterAction {
      left: 0;
      right: auto;
    }

    .FilterGrid {
      grid-template-columns: 1fr;
    }
  }
`;

export function DashboardDateFilters() {
  const params = useSearchParams();
  return (
    <DateFilters key={`${params.get("startDate")}:${params.get("endDate")}`} />
  );
}
function DateFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const boardId = useId();
  const calendarPopupClass = `dashboard-date-filter-calendar-${boardId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const filtersRef = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    if (!showFilter) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !filtersRef.current?.contains(event.target) &&
        // Calendar popups render outside the board to avoid clipping.
        !(
          event.target instanceof Element &&
          event.target.closest(`.${calendarPopupClass}`)
        )
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [showFilter, calendarPopupClass]);
  const today = String(formatDate(new Date(), "YYYY-MM-DD"));
  const isFiltered = [params.get("startDate"), params.get("endDate")].some(
    (date) => date && date !== today,
  );
  const [start, setStart] = useState<Date | null>(
    params.get("startDate") ? new Date(params.get("startDate")!) : null,
  );
  const [end, setEnd] = useState<Date | null>(
    params.get("endDate") ? new Date(params.get("endDate")!) : null,
  );
  function apply(clear = false) {
    const next = new URLSearchParams(params.toString());
    for (const [name, date] of [
      ["startDate", start],
      ["endDate", end],
    ] as const) {
      if (date && !clear)
        next.set(name, String(formatDate(date, "YYYY-MM-DD")));
      else next.delete(name);
    }
    next.delete("page");
    router.replace(`?${next}`);
    setShowFilter(false);
  }
  return (
    <DateFiltersContainer ref={filtersRef}>
      <Button
        classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY, ButtonClass.WITH_ICON]}
        aria-expanded={showFilter}
        aria-controls={showFilter ? boardId : undefined}
        onClick={() => setShowFilter(!showFilter)}
      >
        {isFiltered ? "Filtered" : "Today"}
        <Icon icon="mi:chevron-down" width={16} height={16} />
      </Button>
      {showFilter && (
        <div className="FilterAction" id={boardId}>
          <Flex justify="space-between" align="center">
            <h3>Filter by:</h3>
            <Button
              classes={[ButtonClass.ICON_ONLY]}
              aria-label="Close date filters"
              onClick={() => setShowFilter(false)}
            >
              <Icon icon="ic:round-close" width={20} height={20} />
            </Button>
          </Flex>
          <div className="FilterGrid">
            <DatePickerInput
              label="Start date"
              placeholder="Today"
              value={start ?? undefined}
              onChange={setStart}
              popupClassName={calendarPopupClass}
            />
            <DatePickerInput
              label="End date"
              placeholder="Today"
              value={end ?? undefined}
              onChange={setEnd}
              popupClassName={calendarPopupClass}
            />
          </div>
          <Flex
            justify="flex-end"
            gap="0.75rem"
            wrap="wrap"
            style={{ marginTop: "2rem" }}
          >
            <Button
              classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
              style={{ height: "2rem" }}
              onClick={() => {
                setStart(null);
                setEnd(null);
                apply(true);
              }}
            >
              Clear filter
            </Button>
            <Button
              classes={[ButtonClass.SOLID]}
              style={{ height: "2rem" }}
              onClick={() => apply()}
            >
              Apply filter
            </Button>
          </Flex>
        </div>
      )}
    </DateFiltersContainer>
  );
}
