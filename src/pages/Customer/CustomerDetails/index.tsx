/**
 * 客户详情页
 * */
import type { ConnectState } from "@/models/connect";
import type { MatchDataProps } from "@/services/data";
import { Card, Descriptions, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import type { Dispatch } from "umi";
import { connect } from "umi";
import CustomerInfo from "../components/CustomerInfo";
import CustomerInfoOnlySee from "../components/CustomerInfoOnlySee";
import type { CustomerListItem } from "../data";
import CommunicationBook from "./components/CommunicationBook";
import CustomerStructure from "./components/CustomerStructure";
import styles from './index.less';
 

export interface CutomerDetailsProps {
  match: MatchDataProps;
  pageSpinning?: boolean;
  dispatch: Dispatch;
  currentCustomerInfo?: CustomerListItem;
}
const { TabPane } = Tabs;

const CutomerDetails: React.FC<CutomerDetailsProps> = (props) => {
  const { match, pageSpinning, dispatch, currentCustomerInfo } = props;
  const { params: { id, type } } = match
  const [currentTab, setCurrentTab] = useState('contact');
  const [allPageRefreshFlag, setAllPageRefreshFlag] = useState<boolean>(false);
  const handleTabChange = (val: string) => {
    setCurrentTab(val);
  }
  const getCustomerInfoRequset = async() => {
    dispatch({
      type: 'customer/fetchCustomerInfo',
      payload: id,
    })
  }
  useEffect(() => {
    if(id || allPageRefreshFlag) {
      getCustomerInfoRequset();
      setAllPageRefreshFlag(false);
    }
  }, [id, allPageRefreshFlag]);
  /**
   * 从【我的客户】进来【客户详情】页面（根据参数【type】判断）：
   * 不可操作部门；不能分配联系人；不能修改客户基础档案信息。
   * */ 
  const tabList = [
    {
      key: 'contact',
      tab: '通讯录',
      component: () => (
        <CommunicationBook 
          customerId={id}
          type={type}
        />
      ),
    },
    {
      key: 'structure',
      tab: '组织架构',
      component: () => (
        <CustomerStructure />
      ),
    },
    {
      key: 'fileInfo',
      tab: '档案',
      component: () => (
        <div style={{ maxWidth: 600 }}>
          {type === 'all' ? (
            <CustomerInfo 
              handleType="edit"
              customerFileRecord={currentCustomerInfo}
              onSaveOrCancel={setAllPageRefreshFlag}
            />
          ) : (
            <CustomerInfoOnlySee 
              customerFileRecord={currentCustomerInfo}
            />
          )}
      </div>
      ),
    },
  ];
  const cardTitleRender = (
    <Descriptions column={3} size="middle" className={styles.customerInfoDetails}>
      <Descriptions.Item label="客户编号">{currentCustomerInfo?.customerCode}</Descriptions.Item>
      <Descriptions.Item label="客户简称">{currentCustomerInfo?.customerShortName}</Descriptions.Item>
      <Descriptions.Item label="客户名称">{currentCustomerInfo?.customerName}</Descriptions.Item>
    </Descriptions>
  );
  return (
    <Spin spinning={pageSpinning}>
      <div className={styles.commonTabInfo}>
        <Card bordered className={styles.commonTabInfoCard}>
          {cardTitleRender}
          <Tabs activeKey={currentTab} onChange={handleTabChange} type="card">
            {tabList?.map(item => (
              <TabPane tab={item?.tab} key={item?.key}>
                <div>
                  {item?.component()}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    </Spin>
  );
}

export default connect(({ loading, customer }: ConnectState) => ({
  pageSpinning: loading.effects['customer/fetchCustomerInfo'],
  currentCustomerInfo: customer.currentCustomerInfo,
}))(CutomerDetails);