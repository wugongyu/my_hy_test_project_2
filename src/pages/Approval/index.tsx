/**
 * 所有审批单
 * */ 
import { commonPagination } from "@/config/common";
import type { ConnectState } from "@/models/connect";
import type { CommonEnumsProps, CommonTableListParams, MatchDataProps } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { useEffect, useRef } from "react";
import { connect } from "umi";
import ApprovalAction from "./components/ApprovalAction";
import type { ApprovalListItem } from "./data";
import { approvalTableColumns } from "./handler";
import { getAllInstancesList, getMyApplyInstancesList, getMyAppprovedInstancesList, getMyWaitingAppproveInstancesList } from "./service";
import styles from './index.less';

interface ApprovalListProps {
  globalEnums: CommonEnumsProps[];
  match: MatchDataProps;
}

export const approvalListPathType = {
  ALL_LIST: { path: '/approval/all', label: '审批单查询' },
  MY_APPLICATION: { path: '/approval/myApplication', label: '我发起的' },
  MY_APPROVAL: { path: '/approval/myApproval', label: '我审批的' },
  MY_FINISHED: { path: '/approval/myFinished', label: '我完成的' },
}

const hideCreateUserIdPath = [approvalListPathType.MY_APPLICATION.path];
const hideInstanceStatusPath = [approvalListPathType.MY_APPROVAL.path];

const ApprovalList: React.FC<ApprovalListProps> = (props) => {
  const { globalEnums, match } = props;
  const { path } = match;
  const actionRef = useRef<ActionType>();
  const listRefresh = (resetPageFlag: boolean = false) => {
    actionRef?.current?.reload();
    if(resetPageFlag && actionRef?.current?.reloadAndRest) {
      actionRef?.current?.reloadAndRest();
    }
  }
  useEffect(() => {
    if(path) {
      listRefresh(true);
    }
  }, [path]);
  const handleHideItem = (type: 'user' | 'status') => {
    if(path) {
      const hideFlag = type === 'user' ? hideCreateUserIdPath.includes(path) : 
        hideInstanceStatusPath.includes(path);
      return hideFlag;
    }
    return false;
  }
  const columns: ProColumns<ApprovalListItem>[] = [
    ...approvalTableColumns({
      enums: globalEnums, 
      hideCreateUserId: handleHideItem('user'),
      hideInstanceStatus: handleHideItem('status') }),
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      // colSize: 0.4,
      render: (_, record) => (
        <ApprovalAction 
          match={match}
          refreshList={listRefresh}
          rowDataRecord={record}
        />
      )
    },
  ];
  const fetchList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
    };
    if(currentParams.instanceStatus === 'all') {
      delete currentParams.instanceStatus;
    }
    let res = null;
    if(path === approvalListPathType.ALL_LIST.path) {
      res = await getAllInstancesList(currentParams);
    }
    if(path === approvalListPathType.MY_APPLICATION.path) {
      res = await getMyApplyInstancesList(currentParams);
    }
    if(path === approvalListPathType.MY_APPROVAL.path) {
      res = await getMyWaitingAppproveInstancesList(currentParams);
    }
    if(path === approvalListPathType.MY_FINISHED.path) {
      res = await getMyAppprovedInstancesList(currentParams);
    }
    return handleFormatTableData(res);
  }
  return (
    <>
      <ProTable 
        actionRef={actionRef}
        headerTitle=""
        rowKey='approvalCode'
        columns={columns}
        pagination={commonPagination}
        search={{
          collapseRender: false,
          defaultColsNumber: 8,
          span: {
            xs: 8,
            sm: 6,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          },
          labelWidth: 'auto',
        }}
        className={hideInstanceStatusPath.includes(path) ? styles.tableSearchItemWithoutLabel : styles.approvalListSearchItemWithoutLabel}
        request={async (params: CommonTableListParams) => fetchList(params)}
      />
    </>
  );
};

export default connect(({ enums }: ConnectState) => ({
  globalEnums: enums.globalEnums || [],
}))(ApprovalList);