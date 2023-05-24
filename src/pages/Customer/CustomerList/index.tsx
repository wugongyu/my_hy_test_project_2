import CommonLogModal from "@/components/CommonLogModal";
import { commonPagination } from "@/config/common";
import { logTableNameEnums } from "@/config/logConfig";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, Col, message, Row } from "antd";
import { useRef, useState } from "react";
import AssignCustomerContactModal from "../components/AssignCustomerContactModal";
import CustomerOperateModal from "../components/CustomerOperateModal";
import type { CustomerListItem } from "../data";
import { customerTableColumns, customerTableColumnsSearchItem, handleToCustomerDetails } from "../handler";
import { getCustomersList } from "../service";

interface LogDataProps {
  visible: boolean,
  primaryKey: string;
  data?: CustomerListItem,
}

const initLogData: LogDataProps = {
  visible: false,
  primaryKey: '',
}
const customerListRowKey = 'customerId';
const CustomerList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedTableData, setSelectedTableData] = useState<CustomerListItem[]>([]);
  let cancleRowKeys: string[] = []; // 取消选择的项目
  const [addCustomerModalVisible, setCusomerModalVisible] = useState<boolean>(false);
  const [assignContactsModalVisible, setAssignContactsModalVisible] = useState<boolean>(false);
  const [logModalData, setLogModalData] = useState<LogDataProps>(initLogData);
  const handleLog = (data: CustomerListItem) => {
    if(!data.customerId) {
      message.error('客户id不存在！');
      return;
    }
    setLogModalData({
      visible: true,
      primaryKey: data.customerId,
      data,
    })
  } 
  const columns: ProColumns<CustomerListItem>[] = [
    ...customerTableColumnsSearchItem,
    ...customerTableColumns(false),
    {
      title: '操作',
      width: 120,
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="details" onClick={() => handleToCustomerDetails(false, record)}>详情</a>,
        <a key='log' onClick={() => handleLog(record)}>日志</a>,
      ],
    },
  ];
  const refreshList = (resetPage: boolean = false) => {
    actionRef?.current?.reload();
    setSelectedTableData([]);
    cancleRowKeys = [];
    if(resetPage && actionRef?.current?.reloadAndRest) {
      actionRef?.current?.reloadAndRest();
    }
  }
  const handleAdd = () => {
    setCusomerModalVisible(true);
  }
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: CustomerListItem[],
  ) => {
    // 已选择列表
    const alreadySelectedKeys = selectedTableData?.map(item => item[customerListRowKey]);
    // 过滤掉当前已在选择列表中的数据
    const filterData = selectedRows?.filter(item => !alreadySelectedKeys.includes(item[customerListRowKey]));
    // 过滤掉当前取消选择的数据
    const totalFilter = [...selectedTableData, ...filterData]?.filter(item => !cancleRowKeys.includes(item[customerListRowKey]));
    setSelectedTableData(totalFilter);
    cancleRowKeys = [];
  };
  const handleAssign = () => {
    if(selectedTableData?.length === 0) {
      message.error('请先选择客户再进行分配！');
      return;
    }
    setAssignContactsModalVisible(true);
  }
  const fetchList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
    };
    const res = await getCustomersList(currentParams);
    return handleFormatTableData(res);
  }
  // 用户手动选择/取消选择某行的回调
  const onSelect = (record: CustomerListItem, selected: boolean) => {
		if (!selected) {
      // 取消选择
      cancleRowKeys = [record[customerListRowKey]];
		}
	}
  const onMulSelect = (selected: boolean, _selectedRows: any, changeRows: Record<string, any>[]) => {
		if (!selected) {
			cancleRowKeys = changeRows.map((item: Record<string, any>) => item[customerListRowKey]);
		}
	}
  const headerRender = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 10 }}
        onClick={handleAdd}
      >新建客户</Button>
      <Button
        type="primary"
        onClick={handleAssign}
      >分配客户</Button>
    </>
  );
  const logTitleRender = (
    <Row>
      <Col span={10}>
        <span>客户编号：{logModalData?.data?.customerCode || ''}</span>
      </Col>
      <Col span={14}>
        <span>客户名称：{logModalData?.data?.customerName || ''}</span>
      </Col>
    </Row>
  );
  return (
    <>
      <ProTable 
        actionRef={actionRef}
        headerTitle={headerRender}
        rowKey={customerListRowKey}
        columns={columns}
        pagination={commonPagination}
        rowSelection={{
          selectedRowKeys: selectedTableData?.map(item => item.customerId),
          onChange: onRowSelectionChange, // 选中项发生变化时的回调
          onSelect, // 用户手动选择/取消选择某行的回调
          onSelectMultiple: onMulSelect, // 用户使用键盘 shift 选择多行的回调
          onSelectAll: onMulSelect, // 用户手动选择/取消选择所有行的回调
        }}
        tableAlertRender={() => {
          return `已选择 ${selectedTableData.length} 项`;
        }}
        tableAlertOptionRender={() => {
          return <a onClick={() => {
            setSelectedTableData([]);
            cancleRowKeys = [];
          }}>取消选择</a>
        }}
        request={async (params: CommonTableListParams) => fetchList(params)}
      />
      {addCustomerModalVisible && (
        <CustomerOperateModal 
          visible={addCustomerModalVisible}
          onVisibleChange={setCusomerModalVisible}
          onRefresh={refreshList}
        />
      )}
      {assignContactsModalVisible && (
        <AssignCustomerContactModal 
          visible={assignContactsModalVisible}
          onVisibleChange={setAssignContactsModalVisible}
          onRefresh={refreshList}
          selectedRowData={selectedTableData}
          handleType="customer"
        />
      )}
      {logModalData.visible && (
        <CommonLogModal 
          logVisible={logModalData.visible}
          onVisibleChange={(val) => setLogModalData({
            ...initLogData,
            visible: val,
          })}
          primaryKey={logModalData.primaryKey}
          tableName={logTableNameEnums.CUSTOMER_LOG.value}
          titleRender={logTitleRender}
        />
      )}
    </>
  );
};

export default CustomerList;