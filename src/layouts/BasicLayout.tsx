// 全局基本页面布局
/**
 * Ant Design Pro use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
 import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings} from '@ant-design/pro-layout';
import ProLayout, { PageContainer,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect, useIntl } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState, UserModelState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import { copyright } from '@/config/app';
import logo from '@/assets/logo.png';
import styles from './BasicLayout.less';

const noMatch = (
  <Result
    status="403"
    title="权限不足"
    subTitle="抱歉，您无法访问当前页面。"
    extra={
      <Button type="primary">
        <Link to="/">首页</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  user: UserModelState;
  promptRoutes: string[];
  userMenuAuth: string[];
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const defaultFooterDom = <DefaultFooter copyright={copyright} links={[]} />;

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  const handledMenuList = menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    // return Authorized.check(item.menuCode, localItem, null) as MenuDataItem;
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
  return handledMenuList;
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    route: routeVal,
    user,
  } = props;
  /**
   * constructor
   */
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'usermenu/handleMenu',
        payload: {
          routes: routeVal.routes,
          menuList: menuDataRender(routeVal.routes || []),
        },
      });
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
      dispatch({
        type: 'enums/fetchWorkFlowEnums',
      });
      dispatch({
        type: 'enums/fetchGlobalEnums'
      });
      dispatch({
        type: 'global/fetchRootRegions'
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      className={styles.globalBasicLayout}
      headerHeight={40}
      logo={logo}
      formatMessage={formatMessage}
      waterMarkProps={{
        content: user?.currentUser?.username || '',
      }}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          <span>
            {logoDom}
           {titleDom}
          </span>
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return (<Link to={menuItemProps.path}>
          <span>
            {defaultDom}
          </span>
        </Link>);
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        <PageContainer>
          {children}
        </PageContainer>
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, user, usermenu }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  user,
  usermenu,
  userMenuAuth: usermenu.userMenuAuth || [],
  promptRoutes: global.promptRoutes || [],
}))(BasicLayout);
