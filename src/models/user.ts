import type { Effect, Reducer } from 'umi';
import { getUserInfo } from '@/services/user';
import defaultAvatar from '@/assets/default_avator.png';

// 用户信息注释
export interface CurrentUser {
  enumber?: string; // 员工工号
  accountId?: string; // 账号标识
  loginId?: string; // 登陆账号
  avatar?: string;
  lastModified?: string;
  nickName?: string; // 用户名称
  username?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response || {},
      });
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      const currentUser = payload.accountId
        ? {
            ...payload,
            avatar: payload.avatar || defaultAvatar,
            username: payload?.nickname || payload?.nickName || payload?.loginId,
          }
        : {};
      return {
        ...state,
        currentUser,
      };
    },
  },
};

export default UserModel;
