import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps} from 'umi';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import {
  history,
  connect,
} from 'umi';
// import { stringify } from 'querystring';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import { getPageQuery, getTokenStorage, removeTokenStorage, setTokenStorage } from '@/utils/handleLoginInfo';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // 登录认证规则（比如判断 currentUser/token 是否存在）
    // const isLogin = currentUser && currentUser.id;
    let isLogin = getTokenStorage();
    const { pathname } = window.location;
    // 自定义登陆页面
    const loginPath = '/user/login';
    const queryString = stringify({
      redirect: window.location.href,
    });
    const currentLogin = pathname === loginPath; // 是否处于登录界面
    const { token: tokenQuery } = getPageQuery();
    if (tokenQuery) {
      isLogin = tokenQuery;
      if (pathname === loginPath) {
        // 如果是登录路由并且带上token参数，代表从外部登录跳转回来，直接到首页
        history.replace('/');
      } else {
        history.replace(pathname);
      }
    }
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && !currentLogin) {
      // 跳转至自定义登陆页面
      removeTokenStorage();
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    setTokenStorage(isLogin as string);
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
