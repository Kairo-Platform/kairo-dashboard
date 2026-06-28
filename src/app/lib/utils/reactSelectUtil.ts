import { theme as appTheme } from "@/app/styles/Theme";
import type { ThemeType } from "@/app/styles/Theme";
import caretDownIcon from "./icons/caret-down.svg";
export const reactSelectTheme = (customTheme: ThemeType = appTheme) => {
  return (theme: Record<string, any>) => ({
    ...theme,
    outline: "none",
    borderRadius: "0",
    colors: {
      ...theme.colors,
      primary75: `${customTheme.colors.gray_02}`,
      primary50: `${customTheme.colors.gray_02}`,
      primary25: `${customTheme.colors.gray_02}`,
      primary: customTheme.colors.gray_02,
    },
  });
};

type StyleFn = (
  provided: Record<string, any>,
  state?: Record<string, any>,
) => Record<string, any>;

const reactSelectStyles: Record<string, StyleFn> = {
  control: (provided) => ({
    ...provided,
    border: 0,
    boxShadow: "none",
    minHeight: 0,
    alignItems: "flex-start",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "1rem",
    width: "min-content",
  }),
  singleValue: (provided) => ({
    ...provided,
    marginLeft: 0,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    cursor: "text",
    gridTemplateColumns: "0 max-content",
  }),
  placeholder: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: appTheme.colors.text_07,
    whiteSpace: "nowrap",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingRight: 0,
    '& [class$="indicatorContainer"]': {
      cursor: "pointer",
      padding: "0 4px",
      "&:last-child": {
        position: "relative",
        width: "28px",
        height: "20px",
        "&:before": {
          position: "absolute",
          top: "1px",
          left: 0,
          content: '" "',
          display: "block",
          backgroundImage: `url('${caretDownIcon}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "0.8rem",
          width: "100%",
          height: "100%",
          opacity: 1,
        },
        svg: {
          display: "none",
        },
      },
    },
    '& [class$="indicatorSeparator"]': {
      display: "none",
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "0.85rem",
  }),
  menuList: (provided) => ({
    ...provided,
    overflow: "overlay",
    maxHeight: "200px",
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    borderRadius: "0.5rem",

    color:
      state && state.isSelected
        ? appTheme.colors.text_01
        : appTheme.colors.text_08,
    backgroundColor:
      state && state.isSelected
        ? appTheme.colors.gray_02
        : provided.backgroundColor,
    ...(state && state.isFocused
      ? { backgroundColor: appTheme.colors.gray_02 }
      : {}),
  }),
};

export const reactSelectUtil = {
  theme: reactSelectTheme,
  styles: reactSelectStyles,
};

export default reactSelectUtil;
