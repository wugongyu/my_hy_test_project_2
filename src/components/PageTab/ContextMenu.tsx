import React, { useContext } from 'react';
import { context } from './context';
import type { Tab, Position, ContextMenuLabels } from './types';
import { CONTEXT_ACTIONS } from './types';
import styles from './index.less';

interface ContextMenuProps {
  tab: Tab | undefined; // 标签数据
  position: Position | undefined;
  history: any;
  handleTabClose: Function; // 关闭标签的回调
  menuLabels?: ContextMenuLabels; // 批量操作标签的label(如“关闭当前标签”等)
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const { tab, position, history, handleTabClose, menuLabels } = props;
  const store = useContext(context);
  const { tabs, dispatch } = store;

  const updateTabs = (newTabs: Tab[]) => {
    dispatch({
      type: CONTEXT_ACTIONS.UPDATE_TABS,
      payload: newTabs,
    });
  };

  const closeTab = () => {
    if (!tab) return;
    handleTabClose(tab.location.pathname, 'remove');
  };

  const closeRightTabs = () => {
    if (!tab) return;
    const index = tabs.indexOf(tab);
    if (index < 0) return;
    history.push(tab.location);
    updateTabs(tabs.slice(0, index + 1));
  };

  const closeAllTabs = () => {
    history.push('/');
    updateTabs([]);
  };

  return (
    <ul
      className={`${styles.contextMenu} ${tab && styles.show}`}
      style={{ left: position?.x, top: position?.y }}
    >
      <li onClick={closeTab}>{menuLabels?.closeTab || '关闭当前标签'}</li>
      <li onClick={closeRightTabs}>{menuLabels?.closeRightTabs || '关闭右边标签'}</li>
      <li onClick={closeAllTabs}>{menuLabels?.closeAllTabs || '关闭所有标签'}</li>
    </ul>
  );
};

export default ContextMenu;
