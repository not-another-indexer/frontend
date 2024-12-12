export enum ScreenType {
  MOBILE = 768,
  TABLET = 1023,
  DESKTOP = 1215,
  WIDESCREEN = 1407,
  FULL_HD
}

export function countScreenType(): ScreenType {
  const width = window.innerWidth

  if (width < ScreenType.MOBILE) {
    return ScreenType.MOBILE
  } else if (width < ScreenType.TABLET) {
    return ScreenType.TABLET
  } else if (width < ScreenType.DESKTOP) {
    return ScreenType.DESKTOP
  } else if (width < ScreenType.WIDESCREEN) {
    return ScreenType.WIDESCREEN
  } else {
    return ScreenType.FULL_HD
  }
}