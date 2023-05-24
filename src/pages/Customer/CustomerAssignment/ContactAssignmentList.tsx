/**
 * 联系人分配列表
 * */ 
import { commonPagination } from "@/config/common";
import { defaultColConfig } from "@/config/dictionary";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import type { RecycleModalDataProps } from "./index";
import { initRecycleModalData } from "./index";
import RecycleModal from "../components/RecycleModal";
import type { CustomerContactListItem } from "../data";
import { customerAssignContactTableColumns } from "../handler";
import styles from './index.less';
import type { CommonTableListParams } from "@/services/data";
import { getContactsAssignmentList } from "../service";
import { handleFormatTableData } from "@/utils/utils";

export interface ContactAssignmentListProps{
  pageRefreshFlag: boolean;
  onPageRefreshFlagChange: (val: boolean) => void;
  currentTab: string;
  tabKey: string;
}

const ContactAssignmentList: React.FC<ContactAssignmentListProps> = (props) => {
  const { pageRefreshFlag, onPageRefreshFlagChange, currentTab, tabKey } = props;
  const actionRef = useRef<ActionType>();
  const [selectedTableData, setSelectedTableData] = useState<CustomerContactListItem[]>([]);
  
  const columns: ProColumns<CustomerContactListItem>[] = [
    ...customerAssignContactTableColumns('contact'),
  ];
  const [recycleModalData, setRecycleModalData] = useState<RecycleModalDataProps>(initRecycleModalData);
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: CustomerContactListItem[],
  ) => {
    setSelectedTableData(selectedRows);
  };
  const refreshList = (resetPage: boolean = false) => {
    actionRef?.current?.reload();
    setSelectedTableData([]);
    if(resetPage && actionRef?.current?.reloadAndRest) {
      actionRef?.current?.reloadAndRest();
    }
  }
  useEffect(() => {
    if(pageRefreshFlag && currentTab === tabKey) {
      refreshList();
      onPageRefreshFlagChange(false);
    }
  }, [pageRefreshFlag]);
  const handleRecycle = (type: 'customer' | 'contact') => {
    if(selectedTableData?.length === 0) {
      message.error('请先选中数据再进行回收！');
      return;
    }
    setRecycleModalData({
      visible: true,
      handleType: type,
    })
  }
  const handleCloseModal = (val: boolean) => {
    setRecycleModalData({
      ...initRecycleModalData,
      visible: val,
    })
  }
  const fetchList = async(params: CommonTableListParams) => {
    setSelectedTableData([]);
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
    };
    const res = await getContactsAssignmentList(currentParams);
    return handleFormatTableData(res, true);
  }
  const headerRender = (
    <>
      <Button 
        type="primary" 
        style={{ marginRight: 10 }}
        onClick={() => handleRecycle('contact')}
      >回收联系人</Button>
    </>
  );
  return (
    <>
      <ProTable 
        actionRef={actionRef}
        headerTitle={headerRender}
        rowKey='uid'
        columns={columns}
        pagination={commonPagination}
        rowSelection={{
          selectedRowKeys: selectedTableData?.map(item => item.uid),
          onChange: onRowSelectionChange,
        }}
        className={styles.tableSearchItemWithoutLabel}
        search={{
          defaultColsNumber: 6,
          span: defaultColConfig,
          collapseRender: false,
        }}
        request={async (params: CommonTableListParams) => fetchList(params)}
      />
      {recycleModalData.visible && (
        <RecycleModal
          handleType={recycleModalData.handleType}
          visible={recycleModalData.visible}
          onVisibleChange={handleCloseModal}
          onRefresh={refreshList}
          selectedRowData={selectedTableData}
        />
      )}
    </>
  );
};

export default ContactAssignmentList;