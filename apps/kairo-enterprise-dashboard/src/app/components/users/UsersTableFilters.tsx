"use client";

import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { DatePickerInput, SearchInput } from "@/app/components/ui/inputs";
import { Icon } from "@iconify/react";
import { DATE_FORMAT, formatDate } from "@kairo/lib/utils";

const UsersTableFiltersContainer = styled.div`
  position: relative;
  width: 100%;

  .FilterAction {
    position: absolute;
    top: 3.5rem;
    left: 18%;
    z-index: 1;
    background: ${(props) => props.theme.colors.ui_07};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border-radius: 1rem;
    padding: 1.5rem 1rem 1rem 1rem;
    max-width: 30rem;
    min-width: 20rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .FilterAction h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .FilterAction .FilterGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 600px) {
    .FilterAction {
      left: 0;
      right: 0;
      min-width: unset;
      max-width: 100vw;
    }

    .FilterAction .FilterGrid {
      grid-template-columns: 1fr;
    }
  }
`;

export const UsersTableFilters: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [filterStartDate, setFilterStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [filterEndDate, setFilterEndDate] = useState(
    searchParams.get("endDate") || "",
  );

  const applyParams = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (search) params.set("search", search);
    else params.delete("search");

    if (filterStartDate) {
      const formattedStart = formatDate(new Date(filterStartDate), DATE_FORMAT);
      params.set("startDate", String(formattedStart));
    } else {
      params.delete("startDate");
    }

    if (filterEndDate) {
      const formattedEnd = formatDate(new Date(filterEndDate), DATE_FORMAT);
      params.set("endDate", String(formattedEnd));
    } else {
      params.delete("endDate");
    }

    params.delete("page");
    params.delete("limit");
    router.replace(`?${params.toString()}`);
  };

  const handleApplyFilter = () => {
    applyParams();
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setSearch("");
    setSearchInput("");
    setFilterStartDate("");
    setFilterEndDate("");

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    ["page", "limit", "startDate", "endDate", "search"].forEach((key) =>
      params.delete(key),
    );
    router.replace(`?${params.toString()}`);
    setShowFilter(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (search) params.set("search", search);
    else params.delete("search");
    params.delete("page");
    params.delete("limit");
    router.replace(`?${params.toString()}`);
  }, [search]);

  return (
    <UsersTableFiltersContainer>
      <Flex gap="1rem" align="center">
        <SearchInput
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput("")}
        />
        <span>
          <Button
            type="button"
            classes={[
              ButtonClass.OUTLINED_GREY_TO_PRIMARY,
              ButtonClass.ICON_ONLY,
            ]}
            onClick={() => setShowFilter(!showFilter)}
            style={{
              height: "3rem",
              width: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0,
            }}
          >
            <Icon icon="mynaui:filter-solid" width={24} height={24} />
          </Button>
        </span>
        {showFilter && (
          <div className="FilterAction">
            <Flex justify="space-between" align="center">
              <h3>Filter by:</h3>
              <div>
                <Button
                  type="button"
                  classes={[ButtonClass.ICON_ONLY]}
                  onClick={() => setShowFilter(false)}
                >
                  <Icon icon="ic:round-close" width={20} height={20} />
                </Button>
              </div>
            </Flex>

            <div className="FilterGrid">
              <DatePickerInput
                label="Start date"
                placeholder="Select start date"
                value={filterStartDate ? new Date(filterStartDate) : undefined}
                onChange={(val: Date | null) =>
                  setFilterStartDate(val ? String(val) : "")
                }
              />
              <DatePickerInput
                label="End date"
                placeholder="Select end date"
                value={filterEndDate ? new Date(filterEndDate) : undefined}
                onChange={(val: Date | null) =>
                  setFilterEndDate(val ? String(val) : "")
                }
              />
            </div>

            <Flex
              justify="flex-end"
              gap="0.75rem"
              style={{ marginTop: "2rem" }}
            >
              <div>
                <Button
                  type="button"
                  classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
                  style={{ height: "2rem" }}
                  onClick={handleClearFilter}
                >
                  Clear filter
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  classes={[ButtonClass.SOLID]}
                  style={{ height: "2rem" }}
                  onClick={handleApplyFilter}
                >
                  Apply filter
                </Button>
              </div>
            </Flex>
          </div>
        )}
      </Flex>
    </UsersTableFiltersContainer>
  );
};

export default UsersTableFilters;
