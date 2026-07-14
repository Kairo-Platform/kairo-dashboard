type OptionLike = string | number | Record<string, any>;

type OptionKeyGetters = {
  getLabel?: (opt: any) => any;
  getValue?: (opt: any) => any;
};

export const mapSelectOptions = (
  options: OptionLike[] = [],
  getOptionKeys?: OptionKeyGetters,
): Array<{ __option?: OptionLike; label: any; value: any }> => {
  return options.map((option) => {
    if (getOptionKeys) {
      const {
        getLabel = (o: any) => (o as any)?.label,
        getValue = (o: any) => (o as any)?.value,
      } = getOptionKeys;
      return {
        __option: option,
        label: getLabel(option),
        value: getValue(option),
      };
    }
    return { label: option, value: option } as { label: any; value: any };
  });
};

export default mapSelectOptions;
