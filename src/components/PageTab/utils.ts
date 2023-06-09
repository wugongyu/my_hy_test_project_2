import isEqual from 'lodash/isEqual';
// 判断是否为当前tab
export function isTabActive(tabKey: string, location: any) {
  return tabKey === location.pathname;
}

export function isLocationChanged(prevLoca: any, currLoca: any) {
  const { key, ...otherPrevloca } = prevLoca;
  const { key: currKey, ...otherCurrloca } = currLoca;
  return !isEqual(otherPrevloca, otherCurrloca);
}
