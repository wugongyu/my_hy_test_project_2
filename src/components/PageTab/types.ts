// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CONTEXT_ACTIONS {
  UPDATE_TABS,
}

/**
 * Tab object（tab标签导航的数据）
 */
export interface Tab {
  route: any;
  location: any;
  children: React.ReactNode;
}

/**
 * Context state to store tab informations（存放关于tab的相关信息）
 */
export interface ContextState {
  tabs: Tab[];
  dispatch: Function;
}

/**
 * Context action to update context state（更新tab的相关信息的操作）
 */
export interface ContextAction {
  type: CONTEXT_ACTIONS;
  payload: Tab[];
}

export interface CurrentHistory extends History {
  location?: any;
}

export interface UmiComponentProps {
  children: React.ReactNode;
  history: CurrentHistory;
  location: any;
  match: { isExact: boolean; params: Object; path: string; url: string };
  route: any;
  routes: any[];
}

export interface Position {
  x: number;
  y: number;
}

export interface ContextMenuLabels {
  closeTab?: string;
  closeRightTabs?: string;
  closeAllTabs?: string;
}

export interface ContextDropdownMenuLabelsProps {
  close?: '关闭当前';
  closeOther?: '关闭其它';
  closeAll?: '关闭所有';
  refresh?: '刷新页面';
}

export interface SkipRouteProps {
  from: any;
  to: any;
  isRemove?: any;
}

export interface SkiprouteProps {
  from?: any;
  to?: any;
  isRemove?: boolean;
}
