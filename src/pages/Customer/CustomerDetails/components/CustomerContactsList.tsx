/**
 * 客户联系人列表
 * */ 
import FixedSearchItemProTable from "@/components/FixedSearchItemCommonProTable";
import { commonPageExtraHeight, commonPagination, commonTableScroll } from "@/config/common";
import { defaultColConfig } from "@/config/dictionary";
import type { ConnectState } from "@/models/connect";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { connect } from "umi";
import ContactOperateModal from "../../components/ContactOperateModal";
import type { CustomerContactListItem, CustomerDepartmentItem, CustomerListItem } from "../../data";
import { customerContactTableColumns } from "../../handler";
import { getCustomerContactInfo, getCustomerContactsList, getMyCustomerContactsList } from "../../service";
import styles from '../index.less';
import type { ContactOperateModalDataProps} from "./CustomerDepartments";
import { initContactOperateModalData } from "./CustomerDepartments";

export interface CustomerContactsListProps {
  customerId: string;
  pageRefreshFlag: boolean;
  onPageRefreshChange?: (val: boolean) => void;
  selectedContactData: CustomerContactListItem[];
  onSelectedContactDataChange: (data: CustomerContactListItem[]) => void;
  treeSelectedDepartmentId?: string;
  type: string;
  allCustomerDepartments: CustomerDepartmentItem[];
  customerInfo?: CustomerListItem;
}

const CustomerContactsList: React.FC<CustomerContactsListProps> = (props) => {
  const { selectedContactData, onSelectedContactDataChange, 
    customerId, treeSelectedDepartmentId,
    type,
  } = props;
  const actionRef = useRef<ActionType>();
  const [contactOperateModalData, setContactOperateModalData] = useState<ContactOperateModalDataProps>(initContactOperateModalData);
  const [editContactBtnLoading, setEditContactBtnLoading] = useState<boolean>(false);
  const listRefresh = (resetPageFlag: boolean = false) => {
    actionRef?.current?.reload();
    if(resetPageFlag && actionRef?.current?.reloadAndRest) {
      actionRef?.current?.reloadAndRest();
    }
  }
  useEffect(() => {
    listRefresh();
  }, [customerId, treeSelectedDepartmentId]);
  const handleCloseContactModal = (flag: boolean) => {
    setContactOperateModalData(initContactOperateModalData)
    if(flag) {
      listRefresh();
    }
  }
  const handleGetContactInfoRequest = async(contactId: string) => {
    const res = await getCustomerContactInfo(contactId);
    if(res?.contactId) return res;
    return null;
  }
  const handleToEditContact = async(data: CustomerContactListItem) => {
    if(!data.contactId) {
      message.error('客户联系人id不存在！');
      return;
    }
    setEditContactBtnLoading(true);
    const resData = await handleGetContactInfoRequest(data.contactId);
    setEditContactBtnLoading(false);
    if(resData) {
      setContactOperateModalData({
        ...initContactOperateModalData,
        visible: true,
        recordData: resData,
      })
    }
  }
  const columns: ProColumns<CustomerContactListItem>[] = [
    ...customerContactTableColumns(),
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      className: styles.actions,
      render: (_, record) => [
        <Button type="link" loading={editContactBtnLoading} key="edit" onClick={() => handleToEditContact(record)}>编辑</Button>,
      ],
    },
  ];
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: CustomerContactListItem[],
  ) => {
    if(onSelectedContactDataChange) {
      onSelectedContactDataChange(selectedRows);
    }
  };
  const fetchList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
      departmentId: treeSelectedDepartmentId,
    };
    let res = null;
    if(type !== 'all') {
      res = await getMyCustomerContactsList(customerId, currentParams) 
    } else {
      res = await getCustomerContactsList(customerId, currentParams);
    }
    return handleFormatTableData(res);
  }
  return (
    <div>
      <FixedSearchItemProTable 
        id="customerContactsList"
        actionRef={actionRef}
        headerTitle=''
        rowKey='contactId'
        options={false}
        columns={columns}
        pagination={commonPagination}
        rowSelection={type === 'all' ? {
          selectedRowKeys: selectedContactData?.map(item => item.contactId),
          onChange: onRowSelectionChange,
        } : false}
        className={styles.tableSearchItemWithoutLabel}
        tableClassName={styles.customerContactsListTable}
        search={{
          defaultColsNumber: 6,
          span: defaultColConfig,
          collapseRender: false,
        }}
        request={async (params: CommonTableListParams) => fetchList(params)}
        scroll={{
          ...commonTableScroll,
          x: 740,
        }}
        // 额外高度除了通用额外高度再加上页码元素的高度
        extraHeight={(commonPageExtraHeight + 48)}
        isAddTableMinHeight
      />
      {contactOperateModalData.visible && (
        <ContactOperateModal 
          customerId={customerId}
          visible={contactOperateModalData.visible}
          onVisibleChange={handleCloseContactModal}
          contactRecord={contactOperateModalData.recordData}
          onContactRecordChange={(data: any) => setContactOperateModalData({
            ...contactOperateModalData,
            recordData: data,
          })}
          onRefresh={listRefresh}
        />
        )
      }
    </div>
  );
};

export default connect(({ customer }: ConnectState) => ({
  customerInfo: customer.currentCustomerInfo,
  treeSelectedDepartmentId: customer.treeSelectedDepartmentId || '',
  allCustomerDepartments: customer.allCustomerDepartments || [],
}))(CustomerContactsList);