/**
 * 问诊报表
 * */
import { commonPagination } from "@/config/common";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance } from "antd";
import { useRef } from "react";
import type { InquiryReportsListItem } from "../data";
import { handleSpecialData, inquiryReportsColumns } from "../handler";
import { getInquiryReportsList } from "../service";
import styles from '../index.less';
 

const InquiryReports: React.FC<{}> = () => {
  const formRef = useRef<FormInstance>();
  const columns: ProColumns<InquiryReportsListItem>[] = [
    ...inquiryReportsColumns(),
  ];
  const getList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, inquiryTime, area, ...rest  } = params;
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
    const res = await getInquiryReportsList(currentParams);
    const handledRes = handleFormatTableData(res);
    const finalData = handleSpecialData({
      handleDataKeysArr: ['consultation_Count', 'visits_Count', 'afterConsultation_Count', 'afterConsultation_Price'], 
      data: handledRes?.data || [],
      targetCountsType: inquiryTime
    });
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
        formRef={formRef}
        pagination={commonPagination}
        request={async(params) => getList(params)}
        search={{
          defaultColsNumber: 6,
          span: 6,
          collapseRender: false,
        }}
        className={styles.inquiryReportsListTable}
      />
    </>
  );
};

export default InquiryReports;