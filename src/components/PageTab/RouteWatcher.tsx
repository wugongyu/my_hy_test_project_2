import React, { useContext, useEffect } from 'react';
// import router from 'umi/router';
import { history } from 'umi';
import { getMunuAuth } from '@/utils/utils';
import { context } from './context';
import type { UmiComponentProps } from './types';
import { CONTEXT_ACTIONS } from './types';
import { isLocationChanged } from './utils';

// 监听路径并对标签做出更新
const RouteWatcher: React.FC<UmiComponentProps> = props => {
  const store = useContext(context);
  const { tabs, dispatch } = store;
  const { children, route, history: currentHistory } = props;
  const { location } = currentHistory;
  const userMenuAuth = getMunuAuth(); // 当前用户的菜单权限
  const inAuth = userMenuAuth.find((item: string) => {
    if(Array.isArray(route?.authority)) {
      return route?.authority?.includes(item);
    }
    if(typeof route?.authority === 'string') {
      return item === route?.authority
    }
    return false;
  }); // 当前路由菜单是否有对应权限
  // 更新标签
  const updateTabs = () => {
    const newTabs = [...tabs];
    const exists = newTabs.find(
      t => t.location.pathname === location.pathname || t.route.name === route.name,
    );
    const tab = { route, location, children };
    if (!route?.authority || inAuth) {
      if (!exists) {
        newTabs.push(tab);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isLocationChanged(exists.location, location)) {
          newTabs.splice(newTabs.indexOf(exists), 1, tab);
        }
      }
      dispatch({
        type: CONTEXT_ACTIONS.UPDATE_TABS,
        payload: newTabs,
      });
    } else {
      // 当前路由菜单无对应的权限
      history.push('/exception/403')
    }
  };

  useEffect(updateTabs, []);
  return <></>;
};

export default RouteWatcher;
