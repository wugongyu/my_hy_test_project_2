/**
 * 销售报表
 * */
import { commonPagination, commonTableScroll } from "@/config/common";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance } from "antd";
import { useRef } from "react";
import type { SalesReportsListItem } from "../data";
import { handleSpecialData, salesReportsColumns } from "../handler";
import { getSaleReportsList } from "../service";
import styles from '../index.less';

const SalesReports: React.FC<{}> = () => {
  const formRef = useRef<FormInstance>();
  const columns: ProColumns<SalesReportsListItem>[] = [
    ...salesReportsColumns(),
  ];
  const getList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, saleTime, area, ...rest  } = params;
    const currentParams = {
      current,
      pageSize,
      provinceCode: '',
      cityCode: '',
      ...rest,
    }
    if(area) {
      currentParams.provinceCode = area[0] ? area[0]?.value : '';
      currentParams.cityCode = area[1] ? area[1]?.value : '';
    }
    const res = await getSaleReportsList(currentParams);
    const handledRes = handleFormatTableData(res);
    const finalData = handleSpecialData({
      handleDataKeysArr: ['scanning_Count',
        'doctor_Count', 'autonomy_Count'],
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
          defaultColsNumber: 8,
          span: 6,
          collapseRender: false,
        }}
        className={styles.salesReportsListTable}
      />
    </>
  );
};

export default SalesReports;