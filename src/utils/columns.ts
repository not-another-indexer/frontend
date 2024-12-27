import { ScreenType } from "./window";

export function screenTypeToNumberOfCols(screenType: ScreenType): number {
  switch (screenType) {
    case ScreenType.MOBILE:
      return 2
    case ScreenType.TABLET:
      return 3
    case ScreenType.DESKTOP:
      return 3
    case ScreenType.WIDESCREEN:
      return 4
    case ScreenType.FULL_HD:
      return 5
  }
} 