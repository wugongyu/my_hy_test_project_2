import { context } from "@/components/PageTab/context";
import { CONTEXT_ACTIONS } from "@/components/PageTab/types";
import { defaultAvatar } from "@/config/app";
import type { CompanyOptionProps } from "@/models/global";
import type { CurrentUser } from "@/models/user";
import { greetLabel } from "@/utils/utils";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Modal, Skeleton } from "antd";
import { useContext } from "react";
import type { Dispatch } from "umi";
import { connect } from "umi";
import styles from '../index.less';

const PageHeaderContent: React.FC<{
  currentUser: CurrentUser;
  companys: CompanyOptionProps[];
  globalSelectedCompany?: CompanyOptionProps;
  dispatch: Dispatch;
}> = (props) => {
  const { currentUser, globalSelectedCompany, companys, dispatch } = props;
  const store = useContext(context);
  const { dispatch: tabDispatch } = store;
  const handleMenuClick = (key: string) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `切换仓库将关闭除首页外的其他菜单页面，确认切换么？`,
      okText: '确定',
      cancelText: '取消',
      className: 'comfirm-modal-tabs-nav',
      onOk: () => {
        const findCompany = companys?.find(item => item.warehouseId?.toString() === key);
        if(findCompany) {
          dispatch({
            type: 'global/changeGlobalSelectedCompany',
            payload: findCompany,
          });
          // 关闭所有的tab
          tabDispatch({
            type: CONTEXT_ACTIONS.UPDATE_TABS,
            payload: [],
          });
        }
      },
    });
  }
  const companysMenuRender = (ops: CompanyOptionProps[], company: CompanyOptionProps) => {
    return <Menu onClick={({key}) => handleMenuClick(key)}>
      {ops?.map(m => (
        <Menu.Item key={m.warehouseId} disabled={m.warehouseId === company.warehouseId}>{m.warehouseName}</Menu.Item>
      ))}
    </Menu>
  } 
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar || defaultAvatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          {globalSelectedCompany && globalSelectedCompany.warehouseId ? (
            <Dropdown
              overlay={() => companysMenuRender(companys, globalSelectedCompany)}
              placement="bottomRight"
              arrow
            >
              <span>
                {globalSelectedCompany.warehouseName || ''}
                <span className={styles.contentTitleDownIcon}>
                 <DownOutlined />
                </span>
              </span>
            </Dropdown>
          ) : (
            <span className={styles.noWarehouseContentTitle} style={{ color: 'red' }}>暂无仓库权限</span>
          )}
        </div>
        <div>
          {greetLabel().greet}，{currentUser.username}
          ，欢迎您来到新react项目！
        </div>
      </div>
    </div>
  );
};

export default connect()(PageHeaderContent);