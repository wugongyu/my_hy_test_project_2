import React, { useState } from 'react';
import { connect } from 'umi';
import { TabLayout } from '@/components/PageTab';
import type { ConnectState } from '@/models/connect';
import HomePage from '@/pages/HomePage';
import { PageLoading } from '@ant-design/pro-layout';

interface DefaultTabProps {
  tabKey: string;
  tabName: string;
  children: React.ReactNode;
}

const contextDropdownMenuLabels = {
  close: '关闭当前',
  closeOther: '关闭其它',
  closeAll: '关闭所有',
};

const TabLayoutNative = (props: any) => {
  const defaultTabInit: DefaultTabProps = {
    tabKey: '/welcome',
    tabName: '首页',
    children: <HomePage />,
  };

  const [defaultTab, setDefaultTab] = useState<DefaultTabProps>(defaultTabInit);

  const homeRefresh = () => {
    // 首页的刷新
    setDefaultTab({
      ...defaultTabInit,
      children: <PageLoading />,
    });
    setTimeout(() => {
      setDefaultTab(defaultTabInit);
    }, 100);
  };

  return (
    <TabLayout
      {...props}
      contextDropdownMenuLabels={contextDropdownMenuLabels}
      defaultTab={defaultTab}
      homeRefresh={homeRefresh}
    />
  );
};

export default connect(({ global }: ConnectState) => ({
  promptRoutes: global.promptRoutes || [],
  globalRefreshContent: global.globalRefreshContent || '',
}))(TabLayoutNative);
