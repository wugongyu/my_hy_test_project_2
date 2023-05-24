/**
 * 分配列表
 * */ 
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import ContactAssignmentList from './ContactAssignmentList';
import CustomerAssignmentList from './CustomerAssignmentList';
import styles from './index.less';

export interface RecycleModalDataProps {
  visible: boolean;
  handleType: 'customer' | 'contact';
}

export const initRecycleModalData: RecycleModalDataProps = {
  visible: false,
  handleType: 'customer',
}

const { TabPane } = Tabs;

const AssignmentList: React.FC<{}> = () => {
  const [currentTab, setCurrentTab] = useState('contactAssign');
  const [pageRefreshFlag, setPageRefreshFlag] = useState(false);
  const handleTabChange = (val: string) => {
    setCurrentTab(val);
    setPageRefreshFlag(true);
  }
  const tabList = [
    {
      key: 'contactAssign',
      tab: '联系人分配明细表',
      component: () => (
        <ContactAssignmentList 
          pageRefreshFlag={pageRefreshFlag}
          onPageRefreshFlagChange={setPageRefreshFlag}
          currentTab={currentTab}
          tabKey="contactAssign"
        />
      ),
    },
    {
      key: 'customerAssign',
      tab: '客户分配明细表',
      component: () => (
        <CustomerAssignmentList 
          pageRefreshFlag={pageRefreshFlag}
          onPageRefreshFlagChange={setPageRefreshFlag}
          currentTab={currentTab}
          tabKey="customerAssign"
        />
      ),
    },
  ];
  return (
    <>
      <div className={styles.commonTabInfo}>
        <Card bordered className={styles.commonTabInfoCard}>
          <Tabs activeKey={currentTab} onChange={handleTabChange} type="card">
            {tabList?.map(item => (
              <TabPane tab={item?.tab} key={item?.key}>
                <div className={styles.assignmentsList}>
                  {item?.component()}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default AssignmentList;