/**
 * 客户部门
 * */ 
import type { ConnectState } from "@/models/connect";
import { arrayToTree } from "@/utils/utils";
import { DownOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, message, Tree } from "antd";
import type { Key} from "react";
import { useEffect, useState } from "react";
import type { Dispatch } from "umi";
import { connect } from "umi";
import type { TreeDataProps } from "@/models/customer";
import ContactOperateModal from "../../components/ContactOperateModal";
import type { CustomerContactListItem, CustomerDepartmentItem, CustomerListItem } from "../../data";
import styles from '../index.less';
import DepartmentOperatorModal from "./DepartmentOperatorModal";
import { deleteCustomerDepartment } from "../../service";
import AssignCustomerContactModal from "../../components/AssignCustomerContactModal";
import ScrollableItem from "@/components/ScrollableItem";

export interface CustomerDepartmentsProps {
  customerId: string;
  customerInfo?: CustomerListItem;
  pageRefreshFlag: boolean;
  onPageRefreshChange?: (val: boolean) => void;
  selectedContactData: CustomerContactListItem[];
  onSelectedContactDataChange: (data: CustomerContactListItem[]) => void;
  customerDepartments: CustomerDepartmentItem[];
  departmentsTreeData: TreeDataProps[];
  dispatch: Dispatch;
  treeSelectedDepartmentId?: string;
  type: string;
}
export interface OperateDepartmentDataProps {
  handleType: 'add' | 'updateName';
  visible: boolean;
  data?: TreeDataProps;
}
export const initOperateDepartmentData: OperateDepartmentDataProps = {
  handleType: 'add',
  visible: false,
  data: undefined,
}
export interface ContactOperateModalDataProps {
  visible: boolean,
  recordData?: Partial<CustomerContactListItem>,
  departmentData?: TreeDataProps,
}
export const initContactOperateModalData: ContactOperateModalDataProps = {
  visible: false,
  recordData: undefined,
  departmentData: undefined,
}
const CustomerDepartments: React.FC<CustomerDepartmentsProps> = (props) => {
  const { customerId, customerInfo, customerDepartments, departmentsTreeData, dispatch,
    pageRefreshFlag, onPageRefreshChange, treeSelectedDepartmentId,
    selectedContactData, type, onSelectedContactDataChange } = props;
  const [operateDepartmentData, setOperateDepartmentData] = useState<OperateDepartmentDataProps>(initOperateDepartmentData);
  const [contactOperateModalData, setContactOperateModalData] = useState<ContactOperateModalDataProps>(initContactOperateModalData);
  const [assignContactsModalVisible, setAssignContactsModalVisible] = useState<boolean>(false);
  const [currentExpendedKeys, setExpendedKeys] = useState<Key[]>([]);
  const [currentMouseEnterItem, setEnterItem] = useState<TreeDataProps | undefined>();
  const handleRefresh = (val: boolean) => {
    onSelectedContactDataChange([]);
    if(onPageRefreshChange) {
      onPageRefreshChange(val);
    }
  }
  const handleCloseModalAndRefresh = (refreshFlag: boolean = false) => {
    setOperateDepartmentData(initOperateDepartmentData);
    if(refreshFlag && customerId) {
      dispatch({
        type: 'customer/fetchCustomerDepartments',
        payload: customerId,
      });
    }
  }
  useEffect(() => {
    let allData = [...customerDepartments];
    if(customerInfo) {
      const rootData: CustomerDepartmentItem = {
        customerId: customerInfo.customerId,
        departmentCode: customerInfo.customerCode,
        departmentName: customerInfo.customerName,
        parentDepartmentId: '',
      };
      allData = [
        rootData,
        ...customerDepartments,
      ];
      const handledData = arrayToTree({ 
        arrList: allData, 
        parentKey: 'parentDepartmentId', 
        itemKey: 'customerId',
        itemTitleKey: 'departmentName',
      });
      dispatch({
        type: 'customer/saveDepartmentTreeData',
        payload: handledData,
      });
    } else {
      dispatch({
        type: 'customer/saveDepartmentTreeData',
        payload: [],
      });
    }
    dispatch({
      type: 'customer/saveAllCustomerDepartments',
      payload: allData,
    });
  }, [customerDepartments, customerInfo, pageRefreshFlag]);
  useEffect(() => {
    if(Array.isArray(departmentsTreeData) && departmentsTreeData[0]) {
      const { key, children = [] } = departmentsTreeData[0];
      const secondChildrenKeys = children?.map(item => item.key) || []; // 二级部门keys
      setExpendedKeys([key, ...secondChildrenKeys]);
    } else {
      setExpendedKeys([]);
    }
  }, [departmentsTreeData]);
  const handleDeleteDepartmentRequset = async(data: TreeDataProps) => {
    if(!customerId && !data.key) {
      message.error('部门信息异常！');
      return;
    }
    const res  = await deleteCustomerDepartment(customerId, data.key);
    if(res?.success) {
      message.success('删除成功');
      handleRefresh(true);
    } else {
      message.error(res?.message || '删除失败！');
    }
  }
  const handleToAddContact = (dData?: TreeDataProps) => {
    setContactOperateModalData({
      ...initContactOperateModalData,
      visible: true,
      departmentData: dData || undefined,
    });
  }
  const handleAssignContacts = () => {
    if(selectedContactData?.length === 0) {
      message.error('请先在右侧列表选择联系人之后再进行分配！');
      return;
    }
    setAssignContactsModalVisible(true);
  }
  const handleCloseContactModal = (refreshFlag: boolean = false) => {
    setContactOperateModalData(initContactOperateModalData);
    if(refreshFlag) {
      handleRefresh(true);
    }
  }
  const handleMenuClick = (key: string, data: TreeDataProps) => {
    if(!data.key) {
      message.error('部门数据异常！');
      return;
    }
    switch(key) {
      case 'addContact':
        handleToAddContact(data);
        break;
      case 'updateDepartmentName':
        setOperateDepartmentData({
          ...initOperateDepartmentData,
          visible: true,
          handleType: 'updateName',
          data,
        });
        break;
      case 'addSubDepartment':
        setOperateDepartmentData({
          ...initOperateDepartmentData,
          visible: true,
          handleType: 'add',
          data,
        });
        break;
      case 'deleteDepartment':
        handleDeleteDepartmentRequset(data);
        break;  
      default:
        break;
    }
  }
  const handleSelectTree = (key: string) => {
    const isSelected = treeSelectedDepartmentId === key; // 是否已选中
    dispatch({
      type: 'customer/saveSelectedDepartmentId',
      payload: isSelected ? '' : key,
    })
  }
  const handleTreeNodeTitleRender = (data: TreeDataProps) => {
    const menu = (
      <Menu
        items={[
          {
            label: '添加联系人',
            key: 'addContact',
          },
          {
            label: '修改部门名称',
            key: 'updateDepartmentName',
          },
          {
            label: '添加下级部门',
            key: 'addSubDepartment',
          },
          {
            label: '删除部门',
            key: 'deleteDepartment',
          },
        ]}
        onClick={({ key }) => handleMenuClick(key, data)}
      />
    );
    const findIsRootNode = data.key === customerInfo?.customerId; // 判断是否为根节点
    return (
      <div className={styles.nodeTitleRender} onMouseEnter={() => setEnterItem(data)} onMouseLeave={() => setEnterItem(undefined)}>
        <span className={styles.nodeTitleRenderText} onClick={() =>handleSelectTree(data.key)}>{data.title}</span>
        {findIsRootNode && (type === 'all') && (
          <a onClick={() => handleMenuClick('addSubDepartment', data)}>
            <PlusOutlined className={styles.titleIcon} />
          </a>
        )}
        {!findIsRootNode && (type === 'all') && ((treeSelectedDepartmentId === data.key) || (currentMouseEnterItem?.key === data.key)) && (
        <Dropdown overlay={menu} trigger={['click']}>
          <MoreOutlined className={styles.titleIcon} />
        </Dropdown>
        )}
      </div>
    )
  }
  return (
    <div className={styles.customerDepartmentsBox}>
      <div className={styles.customerDepartmentsActionBtns}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() =>handleToAddContact()}>新建联系人</Button>
        {type === 'all' && (
          <Button type="primary" onClick={handleAssignContacts}>分配联系人</Button>
        )}
      </div>
      <ScrollableItem className={styles.customerDepartmentsTree} id="customerDepartmentsTree">
        <Tree
          selectedKeys={treeSelectedDepartmentId ? [treeSelectedDepartmentId] : []}
          blockNode
          expandedKeys={currentExpendedKeys}
          onExpand={(keys: Key[]) => setExpendedKeys(keys)}
          switcherIcon={<DownOutlined />}
          treeData={departmentsTreeData}
          titleRender={(nodeData) => handleTreeNodeTitleRender(nodeData)}
        />
      </ScrollableItem>
      {operateDepartmentData?.visible && operateDepartmentData?.data && (
        <DepartmentOperatorModal
          customerId={customerId}
          visible={operateDepartmentData.visible}
          handleType={operateDepartmentData.handleType}
          onVisibleChange={handleCloseModalAndRefresh}
          data={operateDepartmentData.data}
        />
      )}
      {contactOperateModalData.visible && (
        <ContactOperateModal 
          customerId={customerId}
          visible={contactOperateModalData.visible}
          onVisibleChange={handleCloseContactModal}
          contactRecord={contactOperateModalData.recordData}
          onContactRecordChange={(data) => setContactOperateModalData({
            ...contactOperateModalData,
            recordData: data,
          })}
          departmentsData={contactOperateModalData.departmentData}
          onRefresh={handleRefresh}
        />
        )
      }
      {assignContactsModalVisible && (
        <AssignCustomerContactModal 
          visible={assignContactsModalVisible}
          onVisibleChange={setAssignContactsModalVisible}
          onRefresh={handleRefresh}
          selectedRowData={selectedContactData}
          handleType="contact"
          customerId={customerId}
        />
      )}
    </div>
  );
};

export default connect(({ customer }: ConnectState) => ({
  customerDepartments: customer.customerDepartments || [],
  customerInfo: customer.currentCustomerInfo,
  departmentsTreeData: customer.departmentsTreeData || [],
  treeSelectedDepartmentId: customer.treeSelectedDepartmentId || '',
}))(CustomerDepartments);