import type { Reducer, Effect } from 'umi';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { handleNavigation } from '@/utils/utils';
import { getUserMenuAuth } from '@/services/usermenu';
import { setAuthority } from '@/utils/authority';

export interface NavigationProps {
  title: string; // 标题
  description: string; // 描述
  href: string; // 路由
  [key: string]: any;
}

export interface MenuModelState {
  routes?: MenuDataItem[];
  menuList?: MenuDataItem[]; // 记录有权限展示的菜单
  navigationList?: NavigationProps[]; // 记录功能导航菜单列表
  userMenuAuth?: string[]; // 用户的菜单权限值
}

export interface MenuModelType {
  namespace: 'usermenu';
  state: MenuModelState;
  effects: {
    handleMenu: Effect;
    fetchUserMenuAuth: Effect,
  };
  reducers: {
    saveRoutes: Reducer<MenuModelState>;
    saveMenuList: Reducer<MenuModelState>;
    saveNavigationList: Reducer<MenuModelState>;
    saveUserMenuAuth: Reducer<MenuModelState>;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'usermenu',

  state: {
    routes: [],
    menuList: [],
    navigationList: [],
    userMenuAuth: [],
  },

  effects: {
    *handleMenu({ payload }, { put }) {
      yield put({
        type: 'saveRoutes',
        payload: payload.routes || [],
      });
      yield put({
        type: 'saveMenuList',
        payload: payload.menuList || [],
      });
      yield put({
        type: 'saveNavigationList',
        payload: handleNavigation(payload.menuList),
      });
    },
    *fetchUserMenuAuth({ payload }, { call, put }) {
      const authParams = new URLSearchParams();
      authParams.append('appCode', 'customerRelations');
      const response = yield call(getUserMenuAuth, authParams, payload);
      if(Array.isArray(response)) {
        setAuthority(response);
        yield put({
          type: 'saveUserMenuAuth',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveUserMenuAuth(state, { payload }): MenuModelState {
      return {
        ...state,
        userMenuAuth: payload,
      };
    },
    saveRoutes(state, { payload: routes }): MenuModelState {
      return {
        ...state,
        routes,
      };
    },
    saveMenuList(state, { payload: menuList }): MenuModelState {
      return {
        ...state,
        menuList,
      };
    },
    saveNavigationList(state, { payload: navigationList }): MenuModelState {
      return {
        ...state,
        navigationList,
      };
    },
  },
};

export default MenuModel;
