import React, { useState, useContext, useEffect } from 'react';
import { Tabs, Modal } from 'antd';
import { useIntl } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { context, provider as TabsProvider } from './context';
import type {
  UmiComponentProps,
  Tab,
  Position,
  ContextMenuLabels,
  ContextDropdownMenuLabelsProps,
  SkiprouteProps} from './types';
import {
  CONTEXT_ACTIONS
} from './types';
import { isTabActive } from './utils';
import ContextMenu from './ContextMenu';
import ContextRightMenu from './ContextRightMenu';
import DraggableTabs from './DraggableTabs';
import styles from './index.less';

const { TabPane } = Tabs;

/**
 * TabBar component placed on top of a page
 */
const TabBar: React.FC<{
  location: any;
  history: any;
  defaultChildren: React.ReactNode;
  contextMenuLabels?: ContextMenuLabels;
  contextDropdownMenuLabels?: ContextDropdownMenuLabelsProps;
  promptRoutes?: any[];
  defaultTab?: { tabKey: string; children: React.ReactNode; tabName: string };
  homeRefresh?: () => void;
  globalRefreshContent?: string;
}> = props => {
  const [targetTab, setTargetTab] = useState<Tab>();
  const [position, setPosition] = useState<Position>();
  const store = useContext(context);
  const { tabs, dispatch } = store;

  const { formatMessage } = useIntl();

  const {
    location,
    defaultChildren,
    contextMenuLabels,
    history,
    contextDropdownMenuLabels,
    promptRoutes = [],
    defaultTab,
    homeRefresh: handleHomeFefresh,
    globalRefreshContent,
  } = props;
  const isLocationInTab = tabs.some(tab => tab.location.pathname === location.pathname);
  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.location.pathname === key);
    if (tab) {
      history.push(tab.location);
    }
    if (!tab && key === defaultTab?.tabKey) {
      history.push(key);
    }
  };

  const comfirmModal = (pathArr: string[], label = '离开') =>
    new Promise(resolve => {
      const promptRoutesMap = new Map();
      promptRoutes.forEach((item: any) => {
        promptRoutesMap.set(item.location.pathname, 1);
      });
      const findIndex = pathArr.findIndex((item: string) => promptRoutesMap.has(item));
      if (findIndex === -1) {
        resolve(true);
      } else {
        history.push(pathArr[findIndex]);
        Modal.confirm({
          title: '平台提示',
          icon: <ExclamationCircleOutlined />,
          content: `${label}页面${globalRefreshContent}，确定${label}吗？`,
          okText: '确定',
          cancelText: '取消',
          className: 'comfirm-modal-tabs-nav',
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      }
    });

  /**
   * Handle tab remove
   * @param tabKey Key of tab to be removed
   * @param action Name of action
   */
  const handleEdit = async (tabKey: any, action: 'add' | 'remove') => {
    if (action === 'remove') {
      const notSave = await comfirmModal([tabKey]);
      if (!notSave) return; // 当前关闭标签页面存在修改未保存
      const tabIndex = tabs.findIndex(tab => tab.location.pathname === tabKey);
      if (tabIndex < 0) return;
      let nextActiveTab;
      if (isTabActive(tabKey, location)) {
        nextActiveTab = tabs[tabIndex + 1] || tabs[tabIndex - 1] || { location: '/' };
      }
      if (nextActiveTab) {
        history.push(nextActiveTab.location.pathname);
      }
      const newTabs = [...tabs];
      newTabs.splice(tabIndex, 1);
      dispatch({
        type: CONTEXT_ACTIONS.UPDATE_TABS,
        payload: newTabs,
      });
    }
  };

  const [skiproute, setSkiproute] = useState<SkiprouteProps | null>(null);
  const specialDelete = (tabKey: string) => {
    const tabIndex = tabs.findIndex(tab => tab.location.pathname === tabKey);
    if (tabIndex < 0) return;
    const newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);
    dispatch({
      type: CONTEXT_ACTIONS.UPDATE_TABS,
      payload: newTabs,
    });
  };
  // @ts-ignore
  Window.onskiproute = (from: any, to: any, isRemove = true) => {
    history.push(to);
    const findFrom = tabs.findIndex(tab => tab.location.pathname === to);
    if (findFrom < 0) {
      // 当前没有跳转目标标签在，所以需要等待路由标签出来后再删除from的标签
      setSkiproute({
        from,
        to,
        isRemove,
      });
      return;
    }
    if (isRemove) {
      specialDelete(from);
    }
  };

  useEffect(() => {
    if (skiproute?.to === location.pathname) {
      if (skiproute?.isRemove) specialDelete(skiproute?.from);
      setSkiproute(null);
    }
  }, [tabs]);

  // @ts-ignore
  Window.ondeletetab = (url: any) => {
    const tabIndex = tabs.findIndex(tab => tab.location.pathname === url);
    if (tabIndex < 0) return;
    const newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);
    dispatch({
      type: CONTEXT_ACTIONS.UPDATE_TABS,
      payload: newTabs,
    });
  };

  /**
   * Show context menu when right click tab menus
   */
  const handleContextMenu = (e: React.MouseEvent, tab: Tab) => {
    e.preventDefault();
    if (contextMenuLabels) {
      setTargetTab(tab);
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const attachEvents = () => {
    function cleanTargetTab() {
      setTargetTab(undefined);
    }
    document.addEventListener('click', cleanTargetTab);
    return () => {
      document.removeEventListener('click', cleanTargetTab);
    };
  };

  useEffect(attachEvents, []);

  const tabList = defaultTab
    ? tabs.filter(v => v.location.pathname !== defaultTab.tabKey)
    : [...tabs];

  const homeRefresh = () => {
    if (handleHomeFefresh) {
      handleHomeFefresh();
    }
  };

  return (
    <div className={styles.tabContainer}>
      <DraggableTabs
        // @ts-ignore
        hideAdd
        type="editable-card"
        onChange={handleTabChange}
        onEdit={handleEdit}
        activeKey={location.pathname}
        tabBarExtraContent={
          <ContextRightMenu
            location={location}
            position={position}
            history={history}
            handleTabClose={handleEdit}
            menuLabels={contextDropdownMenuLabels}
            comfirmModal={comfirmModal}
            defaultPath={defaultTab?.tabKey}
            homeRefresh={homeRefresh}
          />
        }
      >
        {defaultTab && (
          <TabPane tab="首页" key={defaultTab.tabKey} closable={false}>
            {defaultTab.children}
          </TabPane>
        )}
        {tabList.map(tab => {
          return (
            <TabPane
              tab={
                <span
                  onContextMenu={e => {
                    handleContextMenu(e, tab);
                  }}
                  className={styles.tabLabel}
                >
                  {/* {isNotSave(tab.location.pathname) && (
                    <BellTwoTone style={{marginRight: 5}} />
                  )} */}
                  {tab.route.fullName ? formatMessage({ id: tab.route.fullName }) : tab.route.name}
                </span>
              }
              key={tab.location.pathname}
            >
              {tab.children}
            </TabPane>
          );
        })}
      </DraggableTabs>
      {!isLocationInTab && defaultChildren}
      {contextMenuLabels && (
        <ContextMenu
          tab={targetTab}
          position={position}
          history={history}
          handleTabClose={handleEdit}
          menuLabels={contextMenuLabels}
        />
      )}
    </div>
  );
};

interface TabLayoutProps extends UmiComponentProps {
  contextMenuLabels?: ContextMenuLabels;
  contextDropdownMenuLabels?: ContextDropdownMenuLabelsProps;
  promptRoutes?: any[];
  defaultTab?: { tabKey: string; children: React.ReactNode; tabName: string };
  homeRefresh?: () => void;
  globalRefreshContent?: string;
}

const TabLayout: React.FC<TabLayoutProps> = props => {
  const {
    children,
    location,
    history,
    contextMenuLabels,
    contextDropdownMenuLabels,
    promptRoutes,
    defaultTab,
    homeRefresh,
    ...restProps
  } = props;
  return (
    <TabsProvider>
      <TabBar
        history={history}
        location={location}
        defaultChildren={children}
        defaultTab={defaultTab}
        contextMenuLabels={contextMenuLabels}
        contextDropdownMenuLabels={contextDropdownMenuLabels}
        promptRoutes={promptRoutes}
        homeRefresh={homeRefresh}
        {...restProps}
      />
    </TabsProvider>
  );
};

export default TabLayout;
