/**
 * 用户报表
 * */
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance } from "antd";
import { useRef } from "react";
import { commonPagination, commonTableScroll } from "@/config/common";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { UsersReportsListItem } from "../data";
import { handleSpecialData, usersReportsColumns } from "../handler";
import { getUserReportsList } from "../service";
import styles from '../index.less';

const UsersReports: React.FC<{}> = () => {
  const formRef = useRef<FormInstance>();
  const columns: ProColumns<UsersReportsListItem>[] = [
    ...usersReportsColumns(),
  ];
  const getList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, saleTime, ...rest  } = params;
    const currentParams = {
      current,
      pageSize,
      ...rest,
    }
    const res = await getUserReportsList(currentParams);
    const handledRes = handleFormatTableData(res);
    const finalData = handleSpecialData({
      handleDataKeysArr: ['scanning_Count', 'doctor_Count', 'autonomy_Count',
        'box_Count', 'buyer_Count', 'new_Count'],
      data: handledRes?.data || [], 
      targetCountsType: saleTime})
    return {
      ...handledRes,
      data: finalData,
    };
  }
  return (
    <>
      <ProTable 
        rowKey='id'
        columns={columns}
        scroll={commonTableScroll}
        formRef={formRef}
        request={async(params) => getList(params)}
        pagination={commonPagination}
        search={{
          defaultColsNumber: 6,
          span: 6,
          collapseRender: false,
        }}
        className={styles.usersReportsListTable}
      />
    </>
  );
};

export default UsersReports;