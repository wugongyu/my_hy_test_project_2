import React, { useContext } from 'react';
import { Dropdown, Menu, Tooltip } from 'antd';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import { context } from './context';
import type { Tab, Position, ContextDropdownMenuLabelsProps } from './types';
import { CONTEXT_ACTIONS } from './types';

interface ContextMenuProps {
  location: any; // 当前标签tab
  position: Position | undefined;
  history: any;
  handleTabClose: Function; // 关闭tab的回调
  menuLabels?: ContextDropdownMenuLabelsProps; // 标签的批量操作label
  comfirmModal: (val: string[], label?: string) => Promise<any>;
  defaultPath?: string; // 默认的路径
  homeRefresh: () => void; // 刷新页面的回调
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const {
    location,
    history,
    handleTabClose,
    menuLabels,
    comfirmModal,
    defaultPath = '/',
    homeRefresh,
  } = props;
  const store = useContext(context);
  const { tabs, dispatch } = store;
  const updateTabs = (newTabs: Tab[]) => {
    dispatch({
      type: CONTEXT_ACTIONS.UPDATE_TABS,
      payload: newTabs,
    });
  };

  // 关闭当前标签
  const onRemove = () => {
    if (!location) return;
    handleTabClose(location.pathname, 'remove');
  };

  // 关闭其他标签
  const onRemoveOther = async () => {
    if (!location) return;
    const otherTabs = tabs
      .filter(item => item.location.pathname !== location.pathname)
      .map(v => v.location.pathname);
    const isSave = await comfirmModal([...otherTabs]);
    if (!isSave) return;
    const index = tabs.findIndex(item => item.location.pathname === location.pathname);
    if (index < 0) return;
    history.push(tabs[index].location);
    updateTabs([{ ...tabs[index] }]);
  };

  // 关闭所有标签
  const onRemoveAll = async () => {
    const otherTabs = tabs.map(v => v.location.pathname);
    const isSave = await comfirmModal([...otherTabs]);
    if (!isSave) return;
    history.push(defaultPath);
    updateTabs([]);
  };

  const onRefresh = async () => {
    if (location.pathname === defaultPath) {
      // 首页的刷新
      homeRefresh();
      return;
    }
    // 如果页面是编辑修改了，刷新做提示，返回true继续
    const otherTabs = tabs.map(v => v.location.pathname);
    const isSave = await comfirmModal([...otherTabs], '刷新');
    if (!isSave) return;

    const index = tabs.findIndex(item => item.location.pathname === location.pathname);
    tabs.splice(index, 1);
    history.push(location);
    updateTabs(tabs);
  };

  // 关于tab标签的批量操作
  const onTabsActions = (obj: { key: string }): void => {
    switch (obj?.key) {
      case 'close':
        onRemove();
        break;
      case 'closeother':
        onRemoveOther();
        break;
      case 'closeall':
        onRemoveAll();
        break;
      case 'refresh':
        onRefresh();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {tabs.length > 1 ? (
        <Dropdown
          overlay={
            // @ts-ignore
            <Menu onClick={onTabsActions}>
              {tabs.length > 1 && (
                <Menu.Item key="close">{menuLabels?.close || '关闭当前'}</Menu.Item>
              )}
              {tabs.length > 2 && (
                <Menu.Item key="closeother">{menuLabels?.closeOther || '关闭其它'}</Menu.Item>
              )}
              {tabs.length > 1 && (
                <Menu.Item key="closeall">{menuLabels?.closeAll || '关闭所有'}</Menu.Item>
              )}
              {/* <Menu.Item key="refresh">{menuLabels?.refresh || '刷新当前'}</Menu.Item> */}
            </Menu>
          }
        >
          <a className="ant-dropdown-link">
            操作 <DownOutlined />
          </a>
        </Dropdown>
      ) : (
        ''
      )}
      <Tooltip placement="bottom" title="刷新页面">
        <ReloadOutlined
          onClick={() => onTabsActions({ key: 'refresh' })}
          style={{ marginLeft: 20, marginRight: 20, cursor: 'pointer' }}
        />
      </Tooltip>
    </>
  );
};

export default ContextMenu;
