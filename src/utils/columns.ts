import { ScreenType } from "./window";

export function screenTypeToNumberOfCols(screenType: ScreenType): number {
  switch (screenType) {
    case ScreenType.MOBILE:
      return 1
    case ScreenType.TABLET:
      return 2
    case ScreenType.DESKTOP:
      return 2
    case ScreenType.WIDESCREEN:
      return 2
    case ScreenType.FULL_HD:
      return 3
  }
} 