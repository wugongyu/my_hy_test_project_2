import { parse } from 'querystring';

// 获取重定向url
export const getRedirect = (redirect: string) => {
  let url = redirect;
  if (!url) {
    url = window.location.href;
  }
  return encodeURIComponent(url);
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// token 的本地储存操作
export const WorkLocalStorageAuthItemKey = 'token';
export const getTokenStorage = () => {
  const { token: tokenQuery } = getPageQuery(); // 优先从路由中获取 解决退出登录后要登陆两次的bug
  if (tokenQuery) {
    return tokenQuery;
  }
  const token = window.localStorage.getItem(WorkLocalStorageAuthItemKey);
  return token;
};

export const setTokenStorage = (token: string) => {
  window.localStorage.setItem(WorkLocalStorageAuthItemKey, token || '');
};

export const removeTokenStorage = () => {
  window.localStorage.removeItem(WorkLocalStorageAuthItemKey);
};
