import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage table state and automatically reset filters when switching tables
 * This solves the issue with shallow routing not triggering re-renders
 */
export const useTableStateManager = (currentTableName) => {
  const prevTableName = useRef(currentTableName);
  const [shouldReset, setShouldReset] = useState(false);

  // Initialize the ref on first render if it's undefined
  if (prevTableName.current === undefined) {
    prevTableName.current = currentTableName;
  }

  useEffect(() => {
    // Check if this table should reset its state
    const tableChanged = prevTableName.current !== currentTableName;
    const hadPreviousTable = prevTableName.current !== undefined;
    const currentTableDefined = currentTableName !== undefined;

    const newShouldReset =
      tableChanged && hadPreviousTable && currentTableDefined;

    // Update the ref first
    if (tableChanged) {
      prevTableName.current = currentTableName;
    }

    // Only trigger reset state change if needed
    if (newShouldReset && !shouldReset) {
      setShouldReset(true);
    } else if (!newShouldReset && shouldReset) {
      setShouldReset(false);
    }
  }, [currentTableName]);

  return {
    shouldReset,
    isCurrentTable: true,
  };
};
