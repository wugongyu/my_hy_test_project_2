import type { MenuDataItem } from '@ant-design/pro-layout';
import type { RouterTypes, AnyAction } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import type { StateType } from './login';
import { MenuModelState } from './usermenu';
import { CustomerModelState } from './customer';
import { EnumsModelState } from './enums';

export { GlobalModelState, SettingModelState, UserModelState, MenuModelState, CustomerModelState, EnumsModelState};

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    usermenu?: boolean;
    customer?: boolean;
    enums?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  usermenu: MenuModelState;
  customer: CustomerModelState;
  enums: EnumsModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
