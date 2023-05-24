import RegionCascader from "@/components/RegionCascader";
import RoleBelonger from "@/components/RoleBelonger";
import TableItemTooltips from "@/components/TableItemTooltips";
import TimeRadioButton, { defaultOptions } from "@/components/TimeRadioButton";
import { enumNames } from "@/config/globalEnumsConfig";
import { CommonEnumsProps } from "@/services/data";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";
import type { ProColumns } from "@ant-design/pro-table";
import { commonIndexColumns } from "../Customer/handler";
import type { AuthorizationListItem, InquiryReportsListItem, SalesReportsListItem, UsersReportsListItem } from "./data";

export const drugInfoColumns: ProColumns[] = [
  {
    title: '药品编号',
    dataIndex: 'productId',
    width: 100,
    fieldProps: {
      placeholder: '输入药品编号查找',
    },
  },
  {
    title: '药品名称',
    dataIndex: 'productName',
    width: 100,
    fieldProps: {
      placeholder: '输入药品名称查找',
    },
  },
  {
    title: '规格',
    dataIndex: 'specification',
    hideInSearch: true,
    width: 80,
  },
  {
    title: '生产企业',
    dataIndex: 'manufacturer',
    width: 100,
    fieldProps: {
      placeholder: '输入生产企业查找',
    },
  },
];

export const seachItemColumns = (title: string, dataIndex: string): ProColumns[] => [
  {
    title,
    dataIndex,
    hideInTable: true,
    initialValue: defaultOptions.yestoday.value,
    renderFormItem: () => (
      <TimeRadioButton />
    ),
    colSize: 24,
  },
]

export const salesReportsColumns = (): ProColumns<SalesReportsListItem>[] => {
  return [
    ...seachItemColumns('销售时间', 'saleTime'),
    ...commonIndexColumns,
    {
      title: '销售地区',
      dataIndex: 'area',
      width: 100,
      colSize: 1,
      render: (text, record) => {
        const { province = '', city = '' } = record;
        return `${province}${city}`;
      },
      renderFormItem: (_, formItemProps) => (
        <RegionCascader 
          {...formItemProps}
          isOnlyProvinceAndCity
        />
      ),
    },
    {
      title: '开方医院',
      dataIndex: 'hospital',
      width: 100,
      fieldProps: {
        placeholder: '输入医院名称查找',
      },
    },
    {
      title: '开方科室',
      dataIndex: 'department',
      width: 80,
      fieldProps: {
        placeholder: '输入科室名称查找',
      },
    },
    ...drugInfoColumns,
    {
      title: '扫码开方数',
      dataIndex: 'scanning_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '医生开方数',
      dataIndex: 'doctor_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '自主开方数',
      dataIndex: 'autonomy_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '独立用户数',
      dataIndex: 'unique_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '销售数量',
      dataIndex: 'sales_Count',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '销售金额',
      dataIndex: 'sales_Price',
      hideInSearch: true,
      width: 80,
    },
  ];
}

export const usersReportsColumns = (): ProColumns<UsersReportsListItem>[] => {
  return [
    ...seachItemColumns('销售时间', 'saleTime'),
    ...commonIndexColumns,
    ...drugInfoColumns,
    {
      title: '扫码开方数',
      dataIndex: 'scanning_Count',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '医生开方数',
      dataIndex: 'doctor_Count',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '自主复方数',
      dataIndex: 'autonomy_Count',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '盒数',
      dataIndex: 'box_Count',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '购买人数',
      dataIndex: 'buyer_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '新用户数',
      dataIndex: 'new_Count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '1个月内复购人数',
      dataIndex: 'rebuy1Count',
      hideInSearch: true,
      width: 90,
    },
    {
      title: '3个月内复购人数',
      dataIndex: 'rebuy3Count',
      hideInSearch: true,
      width: 90,
    },
    {
      title: '半年内复购人数',
      dataIndex: 'rebuy6Count',
      hideInSearch: true,
      width: 90,
    },
    {
      title: '一年内复购人数',
      dataIndex: 'rebuy12Count',
      hideInSearch: true,
      width: 90,
    },
    {
      title: '一年以上复购人数',
      dataIndex: 'rebuyOver12Count',
      hideInSearch: true,
      width: 90,
    },
  ];
}

export const inquiryReportsColumns = (): ProColumns<InquiryReportsListItem>[] => {
  return [
    ...seachItemColumns('问诊时间', 'inquiryTime'),
    ...commonIndexColumns,
    {
      title: '地区',
      dataIndex: 'area',
      colSize: 1,
      render: (text, record) => {
        const { province = '', city = '' } = record;
        return `${province}${city}`;
      },
      renderFormItem: (_, formItemProps) => (
        <RegionCascader 
          {...formItemProps}
          isOnlyProvinceAndCity
        />
      ),
    },
    {
      title: '医院',
      dataIndex: 'hospital',
      fieldProps: {
        placeholder: '输入医院名称查找',
      },
    },
    {
      title: '科室',
      dataIndex: 'department',
      fieldProps: {
        placeholder: '输入科室名称查找',
      },
    },
    {
      title: '问诊次数',
      dataIndex: 'consultation_Count',
      hideInSearch: true,
    },
    {
      title: '接诊次数',
      dataIndex: 'visits_Count',
      hideInSearch: true,
    },
    {
      title: '问诊后开方人数',
      dataIndex: 'afterConsultation_Count',
      hideInSearch: true,
    },
    {
      title: '问诊开方金额',
      dataIndex: 'afterConsultation_Price',
      hideInSearch: true,
    },
    {
      title: '合计金额',
      dataIndex: 'totalAmount',
      hideInSearch: true,
    },
  ];
}

export const authorizationListColumns = (params: { 
  rootRegions: Record<string, string>,
  enums?: CommonEnumsProps[],
}): ProColumns<AuthorizationListItem>[] => {
  const { rootRegions, enums }  = params;

  return [
    ...commonIndexColumns,
    {
      title: '授权对象',
      dataIndex: 'authorizedUserId',
      renderFormItem: () => {
        return (
          <RoleBelonger
            placeholder="输入授权对象姓名查找"
          />
        )
      },
      render: (text, record) => record?.authorizedUserName || '',
      width: 100,
    },
    {
      title: '授权地区',
      dataIndex: 'authorizedRegion',
      hideInSearch: true,
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        const { authorizedRegion = [] } = record;
        const regionNames = authorizedRegion?.map(code => rootRegions[code] || '') || [];
        const currentText = regionNames?.join('、');
        return <TableItemTooltips 
          showTextArr={[currentText]}
          tableRecord={record}
          showLineCounts={3}
          valueWidth={120}
        />;
        // return currentText;
      },
    },
    {
      title: '授权品种',
      dataIndex: 'authorizedProduct',
      hideInSearch: true,
      render: (text) => (
        <a>{Array.isArray(text) ? text?.length : 0}</a>
      ),
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'authorizedStatus',
      hideInSearch: true,
      width: 80,
      render: (text, record) => {
        const { authorizedStatus } = record;
        const statusEnums = changeEnumsListToObj({ totalEnums: enums, enumName: enumNames.AUTHORIZED_STATUS_ENUM, valueAsKey: true });
        return statusEnums[authorizedStatus]?.text ? `已${statusEnums[authorizedStatus]?.text}` : '';
      },
    },
    {
      title: '最近操作人',
      dataIndex: 'lastModifiedBy',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '最近修改时间',
      dataIndex: 'lastModified',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 120,
    },
  ];
}

/**
 * @param handleDataKeysArr 数组 需特殊处理的key值
 * @param data 接口返回的列表数据
 * @param targetCountsType 时间统计类型
 * 根据时间统计类型targetCountsType，获取接口返回的对应数值，并展示在列表中，
 * 如targetCountsType 为1，则【scanning_Count】对应接口的数据为【scanning1Count】
 * 
*/
export const handleSpecialData = (params: {handleDataKeysArr: string[], data: any[], targetCountsType: string}) => {
  const { handleDataKeysArr, data, targetCountsType } = params;
  const handledData = data?.map(item => {
    const itemObj = {
      ...item,
    };
    handleDataKeysArr?.forEach(k => {
      const targetKeyStr = k?.replace('_', targetCountsType)
      itemObj[k] = item[targetKeyStr] || 0;
    });
    return itemObj;
  });
  return handledData;
}