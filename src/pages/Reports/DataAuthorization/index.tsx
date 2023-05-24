/**
 * 数据授权
 * */
import { commonPagination, commonTableScroll } from "@/config/common";
import { enumNames } from "@/config/globalEnumsConfig";
import { ConnectState } from "@/models/connect";
import type { CommonEnumsProps, CommonTableListParams } from "@/services/data";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";
import { handleFormatTableData } from "@/utils/utils";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { connect, Dispatch, history } from "umi";
import AuthorizationListAction from "../components/AuthorizationListAction";
import HandleAuthorizedPerson from "../components/HandleAuthorizedPerson";
import type { AuthorizationListItem } from "../data";
import { authorizationListColumns } from "../handler";
import styles from '../index.less';
import { getAuthorizaitonsList } from "../service";

export interface AuthorizedPersonModalDataProps {
  visible: boolean;
  handleType: 'start' | 'stop';
  data: AuthorizationListItem[];
}

export const initAuthorizedPersonModalData: AuthorizedPersonModalDataProps = {
  visible: false,
  handleType: 'start',
  data: []
}

interface DataAuthorizationProps{
  dataAuthorizationListRefreshFlag: boolean;
  dispatch: Dispatch;
  globalRootRegions: Record<string, string>;
  globalEnums: CommonEnumsProps[];
}

const DataAuthorization: React.FC<DataAuthorizationProps> = (props) => {
  const { dataAuthorizationListRefreshFlag, dispatch, globalRootRegions, globalEnums } = props;
  const [selectedTableData, setSelectedTableData] = useState<AuthorizationListItem[]>([]);
  const statusEnums = changeEnumsListToObj({ totalEnums: globalEnums, enumName: enumNames.AUTHORIZED_STATUS_ENUM });
  const actionRef = useRef<ActionType>();
  const refreshList = (resetPageFlag: boolean = false) => {
    actionRef?.current?.reload();
    if(resetPageFlag && actionRef?.current?.reloadAndRest) {
      actionRef?.current?.reloadAndRest();
    }
  }
  useEffect(() => {
    if(dataAuthorizationListRefreshFlag) {
      refreshList();
      dispatch({
        type: 'global/changeDataAuthorizationListRefreshFlag',
        payload: false,
      });
    }
  }, [dataAuthorizationListRefreshFlag])
  const columns: ProColumns<AuthorizationListItem>[] = [
    ...authorizationListColumns({ rootRegions: globalRootRegions, enums: globalEnums}),
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record) => (
        <AuthorizationListAction 
          rowRecord={record}
          refreshList={refreshList}        
        />
      )
    },
  ];
  const [authorizedPersonModalData, setAuthorizedPersonModalData] = useState<AuthorizedPersonModalDataProps>(initAuthorizedPersonModalData);
  const handleStartOrStop = (type: 'start' | 'stop') => {
    if(selectedTableData?.length === 0) {
      message.error('请先选中数据后再进行操作！');
      return;
    }
    let filterData = [];
    if(type === 'stop') {
      // 停用操作，筛选出当前状态为启用的数据
      filterData = selectedTableData?.filter(item => item.authorizedStatus === statusEnums?.Enable?.id);
    } else {
      // 启用操作，筛选出当前状态为停用的数据
      filterData = selectedTableData?.filter(item => item.authorizedStatus === statusEnums?.Disable?.id);
    }
    if(filterData?.length === 0) {
      message.error(`当前选中的数据中可${type === 'start' ? '启用' : '停用'}的数据为0，无需进行操作！`);
      return;
    }
    setAuthorizedPersonModalData({
      visible: true,
      handleType: type,
      data: filterData,
    })
  }
  const handleToAdd = () => {
    history.push('/reports/authorization/add');
  }
  const headerTitleRender = () => (
    <div className={styles.headerActionBtns}>
      <Button type="primary" onClick={() => handleToAdd()}>新增授权</Button>
      <Button type="primary" onClick={() => handleStartOrStop('start')}>启用授权</Button>
      <Button type="primary" onClick={() => handleStartOrStop('stop')}>停用授权</Button>
    </div>
  );
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: AuthorizationListItem[],
  ) => {
    setSelectedTableData(selectedRows);
  };
  const handleCloseModalAndRefreshList = (flag: boolean) => {
    setAuthorizedPersonModalData(initAuthorizedPersonModalData);
    if(flag) {
      setSelectedTableData([]);
      refreshList();
    }
  }
  const fetchList = async(params: CommonTableListParams) => {
    setSelectedTableData([]);
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
    };
    const res = await getAuthorizaitonsList(currentParams);
    return handleFormatTableData(res);
  }
  return (
    <>
      <ProTable
        rowKey='dataAuthorizationId'
        actionRef={actionRef}
        headerTitle={headerTitleRender()}
        columns={columns}
        scroll={commonTableScroll}
        rowSelection={{
          selectedRowKeys: selectedTableData?.map(item => item.dataAuthorizationId),
          onChange: onRowSelectionChange,
        }}
        request={async (params: CommonTableListParams) => fetchList(params)}
        pagination={commonPagination}
      />
      {authorizedPersonModalData?.visible && (
        <HandleAuthorizedPerson 
          visible={authorizedPersonModalData?.visible}
          onVisibleChange={handleCloseModalAndRefreshList}
          selectedData={authorizedPersonModalData.data}
          handleType={authorizedPersonModalData.handleType}
          targetStatusValue={authorizedPersonModalData.handleType === 'start' ? statusEnums?.Enable?.id : statusEnums?.Disable?.id}
        />
      )}
    </>
  );
};

export default connect(({ global, enums }: ConnectState) => ({
  dataAuthorizationListRefreshFlag: global.dataAuthorizationListRefreshFlag || false,
  globalRootRegions: global.globalRootRegions || {},
  globalEnums: enums.globalEnums || []
}))(DataAuthorization);
