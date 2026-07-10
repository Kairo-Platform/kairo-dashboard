import "styled-components";
import type { ThemeType } from "./tokens";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
