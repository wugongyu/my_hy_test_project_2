import type { Effect, Reducer } from 'umi';
import { history } from 'umi';
import { 
  getTicketBeforeCapcha,
  // getUserInfo, 
  innerNetUserLogin } from '@/services/user';
import { getPageQuery, setTokenStorage } from '@/utils/handleLoginInfo';
import { getUserMenuAuth } from '@/services/usermenu';
import { setAuthority } from '@/utils/authority';

export interface StateType {
  status?: 'ok' | 'error';
  message?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    fetchTicketBeforeCapcha: Effect; // 获取验证码之前先获取ticket
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Modal: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 获取验证码之前先获取ticket
    *fetchTicketBeforeCapcha({ payload, callback }, { call, put }) {
      const response = yield call(getTicketBeforeCapcha, payload);
      if (response && response?.access_token) {
        setTokenStorage(response?.access_token || '');
        if (callback) {
          callback(response);
        }
      } else {
        const res = {
          status: 'error',
          message: response?.message || '获取ticket异常！',
        };
        yield put({
          type: 'changeLoginStatus',
          payload: res,
        });
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(innerNetUserLogin, payload);
      const res = {
        status: 'ok',
        message: '',
      };
      if (!response) {
        res.status = '';
        res.message = '';
      }
      if (response && !response?.access_token) {
        res.status = 'error';
        res.message = response?.message || '登录异常！';
      }
      yield put({
        type: 'changeLoginStatus',
        payload: res,
      });
      // Login successfully
      if (response && response?.access_token) {
        const { access_token } = response;
        setTokenStorage(access_token);
        const authParams = new URLSearchParams();
        authParams.append('appCode', 'customer-relations');
        const resAuth = yield call(getUserMenuAuth, authParams, access_token);
        if(Array.isArray(resAuth)) {
          setAuthority(resAuth);
          yield put({
            type: 'saveUserMenuAuth',
            payload: resAuth,
          });
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if ((urlParams.origin.indexOf('localhost') === -1) && redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            const concatString = redirect.indexOf('?') === -1 ? '?' : '&';
            redirect = `${redirect}${concatString}token=${access_token}`;
            window.location.href = redirect;
            return;
          }
        }
        window.localStorage.setItem('used', 'ture'); // 记录客户端浏览器是否登录过本系统
        const redirectUrl = `/welcome?token=${access_token}`;
        // 无redirect直接跳转至首页
        history.push(redirectUrl);
      }
    },
    *logout(_, { put }) {
      const redirectUrl = window.location.href;
      history.push(`/user/login?redirect=${redirectUrl}`);
      // 清空用户信息
      yield put({
        type: 'user/saveCurrentUser',
        payload: {},
      });
      yield put({
        type: 'usermenu/saveUserMenuAuth',
        payload: [],
      });
      // 退出登录清空缓存
      window.localStorage.clear();
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        message: payload.message,
      };
    },
  },
};

export default Modal;
