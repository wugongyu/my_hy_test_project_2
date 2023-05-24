import React from 'react';
import type { Reducer, Subscription, Effect } from 'umi';
import { message } from 'antd';
import { queryNotices } from '@/services/user';
import { getHash, getCurrentHash } from '@/utils/utils';
import type { NoticeIconData } from '@/components/NoticeIcon';
import type { ConnectState } from './connect.d';
import { getRegionals } from '@/services/global';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  versionMessageShow?: boolean;
  collapsed: boolean;
  notices: NoticeItem[];
  tabsNavRef?: any;
  promptRoutes?: string[];
  globalRefreshContent?: string;
  dataAuthorizationListRefreshFlag?: boolean;
  globalRootRegions: Record<string, string>; // 全局的一级区域地址对象
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    hashCompare: Effect;
    fetchRootRegions: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveVersionMessageShow: Reducer<GlobalModelState>;
    changeTabsNavRef: Reducer<GlobalModelState>;
    changePromptRoutes: Reducer<GlobalModelState>;
    changeGlobalRefreshContent: Reducer<GlobalModelState>;
    changeDataAuthorizationListRefreshFlag: Reducer<GlobalModelState>;
    saveRootRegions: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const initGlobalState: GlobalModelState = {
  versionMessageShow: false,
  collapsed: false,
  notices: [],
  tabsNavRef: null,
  promptRoutes: [],
  globalRefreshContent: '会丢失当前填写的内容',
  globalRootRegions: {},
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    ...initGlobalState,
  },

  effects: {
    *fetchRootRegions(_, { call, put }) {
      const res = yield call(getRegionals);
      yield put({
        type: 'saveRootRegions',
        payload: res && Object.keys(res).length > 0 ? res : {},
      });
    },
    *hashCompare({ payload }, { select, put }) {
      const versionMessageShow: boolean = yield select(
        (state: ConnectState) => state.global.versionMessageShow,
      );
      if (!versionMessageShow && payload) {
        yield put({
          type: 'saveVersionMessageShow',
          payload: true,
        });
        message.success({
          content: React.createElement(
            'span',
            {},
            '系统已更新，请刷新后使用。刷新方法：①同时按键盘的 Ctrl 和 F5；②或者 ',
            React.createElement(
              'a',
              {
                onClick: () => {
                  window.location.reload();
                },
              },
              '点击此处',
            ),
          ),
          duration: 0,
        });
        yield put({
          type: 'saveVersionMessageShow',
          payload: false,
        });
      }
    },
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },
  reducers: {
    saveRootRegions(
      state = initGlobalState,
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        globalRootRegions: payload,
      };
    },
    changeDataAuthorizationListRefreshFlag(
      state = initGlobalState,
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        dataAuthorizationListRefreshFlag: payload,
      };
    },
    changeGlobalRefreshContent(
      state = initGlobalState,
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        globalRefreshContent: payload || '会丢失当前填写的内容',
      };
    },
    changePromptRoutes(state = initGlobalState, { payload }): GlobalModelState {
      return {
        ...state,
        promptRoutes: payload || [],
      };
    },
    changeTabsNavRef(state = initGlobalState, { payload }): GlobalModelState {
      const {
        current: { ...restPayload },
      } = payload;
      return {
        ...state,
        tabsNavRef: { current: { ...restPayload } },
      };
    },
    saveVersionMessageShow(state = initGlobalState, { payload }) {
      return {
        ...state,
        versionMessageShow: payload,
      };
    },
    changeLayoutCollapsed(state = initGlobalState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = initGlobalState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: payload,
      };
    },
    saveClearedNotices(state = initGlobalState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        getHash().then((v) => {
          const currentHash = getCurrentHash();
          dispatch({
            type: 'hashCompare',
            payload: v && currentHash !== v,
          });
        });
      });
    },
  },
};

export default GlobalModel;
