// import RoleBelonger from "@/components/RoleBelonger";
import { genderTypeForTable } from "@/config/dictionary";
import type { ProColumns } from "@ant-design/pro-table";
import {  message } from "antd";
import { history } from "umi";
import DecryptPhoneNumber from "./components/DecryptPhoneNumber";
import type { CustomerContactListItem, CustomerListItem } from "./data";

export const handleToCustomerDetails = (isMy: boolean = false, data: CustomerListItem) => {
  if(!data.customerId) {
    message.error('客户id不存在！');
    return;
  }
  const customerType = isMy ? 'mine' : 'all'
  history.push(`/customer/customerDetails/${customerType}/${data.customerId}`);
};
export const commonIndexColumns: ProColumns[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
    render: (_text, record, index, action) => {
      const { pageInfo } = action || {};
      const { pageSize = 10, current = 1 } = pageInfo || {};
      return `${pageSize * (current - 1) + index + 1}`;
    },
  },
]
// 客户columns
export const customerTableColumns = (isMyCustomer: boolean = false): ProColumns<CustomerListItem>[] => [
  ...commonIndexColumns,
  {
    title: '客户编号',
    dataIndex: 'customerCode',
    hideInSearch: true,
  },
  {
    title: '客户简称',
    dataIndex: 'customerShortName',
    hideInSearch: true,
  },
  {
    title: '客户全称',
    dataIndex: 'customerName',
    hideInSearch: true,
    render: (text, record) => {
      return (
        <a
          onClick={() =>handleToCustomerDetails(isMyCustomer, record)}
        >{text}</a>
      );
    },
  },
  {
    title: '联系人数量',
    dataIndex: 'contactCounts',
    hideInSearch: true,
    render: (_, record) => {
      return record.customerStatistics?.contactNum || 0;
    },
  },
  {
    title: '最近操作人',
    dataIndex: 'lastModifiedBy',
    hideInSearch: true,
  },
  {
    title: '最近修改时间',
    dataIndex: 'lastModified',
    valueType: 'dateTime',
    hideInSearch: true,
  },
];

export const customerTableColumnsSearchItem: ProColumns<CustomerListItem>[] = [
  {
    title: '客户名称',
    dataIndex: 'customerName',
    hideInTable: true,
  },
  {
    title: '客户编号',
    dataIndex: 'customerCode',
    hideInTable: true,
  },
];

// 客户分配明细列表
export const customerAssignContactTableColumns = (assignType: 'customer' | 'contact'): ProColumns<CustomerContactListItem>[] => [
  ...commonIndexColumns,
  {
    title: '客户编号',
    dataIndex: 'customerCode',
    hideInSearch: true,
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    fieldProps: {
      placeholder: '输入客户名称',
    },
    render: (text, record) => {
      return (
        <a
          onClick={() =>handleToCustomerDetails(false, record as CustomerListItem)}
        >{text}</a>
      );
    },
  },
  {
    title: '联系人姓名',
    dataIndex: 'contactName',
    hideInTable: assignType === 'customer',
    hideInSearch: assignType === 'customer',
    fieldProps: {
      placeholder: '输入联系人姓名',
    },
  },
  {
    title: '联系人手机',
    dataIndex: 'mobilePhone',
    hideInTable: assignType === 'customer',
    hideInSearch: assignType === 'customer',
    fieldProps: {
      placeholder: '输入联系人手机',
    },
    render: () => '***********',
  },
  {
    title: '联系人职位',
    dataIndex: 'position',
    hideInTable: assignType === 'customer',
    hideInSearch: true,
  },
  {
    title: '联系人部门',
    dataIndex: 'departmentName',
    hideInTable: assignType === 'customer',
    hideInSearch: true,
  },
  {
    title: '归属销售',
    dataIndex: 'assigneeName',
    fieldProps: {
      placeholder: '输入归属销售',
    },
    // renderFormItem: () => {
    //   return (
    //     <RoleBelonger
    //       style={{ width: '100%' }}
    //       labelInValue
    //     />
    //   )
    // },
  },
];

// 客户详情联系人列表
export const customerContactTableColumns = (): ProColumns<CustomerContactListItem>[] => [
  ...commonIndexColumns,
  {
    title: '姓名',
    dataIndex: 'contactName',
    fieldProps: {
      placeholder: '输入联系人姓名',
      title: '输入联系人姓名',
    },
    width: 70,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    hideInSearch: true,
    width: 60,
    valueEnum: genderTypeForTable,
  },
  // {
  //   title: '部门',
  //   dataIndex: 'departmentName',
  //   hideInSearch: true,
  //   width: 100,
  //   render: (_, record) => {
  //     const { departmentId } = record;
  //     const findTarget = departments?.find(item => item.customerId === departmentId);
  //     return findTarget?.departmentName || '';
  //   },
  // },
  {
    title: '职位',
    dataIndex: 'position',
    hideInSearch: true,
    width: 80,
  },
  {
    title: '主要职责',
    dataIndex: 'duty',
    hideInSearch: true,
    width: 100,
  },
  {
    title: '城市',
    dataIndex: 'address',
    fieldProps: {
      placeholder: '输入城市',
    },
    width: 60,
  },
  {
    title: '手机',
    dataIndex: 'mobilePhone',
    fieldProps: {
      placeholder: '输入手机号',
    },
    width: 100,
    render: (_, record) => <DecryptPhoneNumber record={record} />
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    hideInSearch: true,
    width: 80,
  },
]