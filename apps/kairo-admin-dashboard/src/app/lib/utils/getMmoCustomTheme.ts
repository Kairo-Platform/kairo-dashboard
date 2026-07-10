type Mmo =
  | {
      primaryColor?: string;
      secondaryColor?: string;
    }
  | null
  | undefined;

type ThemeLike = {
  colors?: Record<string, any>;
  [key: string]: any;
};

export const getMmoCustomTheme = ({
  theme,
  activeMmo,
}: {
  theme: ThemeLike;
  activeMmo?: Mmo;
}): ThemeLike | undefined => {
  if (activeMmo && activeMmo.primaryColor) {
    return {
      ...theme,
      colors: {
        ...(theme.colors || {}),
        primaryColor: activeMmo.primaryColor,
        // secondaryColor: activeMmo.secondaryColor,
        btnHover: `${activeMmo.primaryColor}DD`,
      },
    };
  }
  return undefined;
};

export default getMmoCustomTheme;
