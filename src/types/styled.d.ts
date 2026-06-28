import "styled-components";
import type { ThemeType } from "@/app/styles/Theme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
