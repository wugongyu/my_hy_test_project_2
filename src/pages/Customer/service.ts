import type { CommonTableListParams } from '@/services/data';
import { requestWithToken } from '@/utils/request';
import { handleParamsFilterNull } from '@/utils/utils';
import type { AssignContactsParams, AssignCustomerParams, CustomerContactListItem, CustomerDepartmentItem, CustomerListItem, RecycleAssignmentParams } from './data';

/**
 * 客户列表
 * */ 

// 获取客户档案列表
export async function getCustomersList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 获取我的客户档案列表
export async function getMyCustomersList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/my-customers/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

/**
 * 客户分配
 * */ 
// 客户分配列表
export async function getCustomersAssignmentList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/assign/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 回收已分配客户
export async function recycleAssignCustomers(data: RecycleAssignmentParams[]) {
  return requestWithToken(`/api/bdpmis/v1/customers/recycle`, {
    method: 'PUT',
    data,
  });
}

// 客户联系人分配列表 
export async function getContactsAssignmentList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/contacts/assignes/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 回收已分配的客户联系人
export async function recycleAssignContacts(data: RecycleAssignmentParams[]) {
  return requestWithToken(`/api/bdpmis/v1/customers/contacts/assignes/recycle`, {
    method: 'DELETE',
    data,
  });
}
/**
 * 客户档案
 * */ 

// 获取客户档案详情
export async function getCustomerInfo(customerId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/query`);
}

// 创建客户档案
export async function createCustomer(data: Partial<CustomerListItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/create`, {
    method: 'POST',
    data,
  });
}

// 更新客户档案
export async function updateCustomer(cutomerId?: string, data?: Partial<CustomerListItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/${cutomerId}/modify`, {
    method: 'PUT',
    data,
  });
}

// 分配客户
export async function assignCustomers(data: AssignCustomerParams) {
  return requestWithToken(`/api/bdpmis/v1/customers/assign`, {
    method: 'PUT',
    data,
  });
}

/**
 * 客户部门
 * */ 

// 添加客户部门
export async function createCustomerDepartment(customerId: string, data: Partial<CustomerDepartmentItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/department/create`, {
    method: 'POST',
    data,
  });
}

// 更新客户部门
export async function updateCustomerDepartment(customerId: string, departmentId: string, data: Partial<CustomerDepartmentItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/departments/${departmentId}/modify`, {
    method: 'PUT',
    data,
  });
}

// 移除部门
export async function deleteCustomerDepartment(customerId: string, departmentId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/departments/${departmentId}/delete`, {
    method: 'DELETE',
  });
}

// 查询客户部门
export async function getCustomerDepartmentsList(customerId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/departments/query`);
}

/**
 * 客户联系人
 * */ 

// 创建客户联系人
export async function createCustomerContact(customerId: string, data: Partial<CustomerContactListItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/create`, {
    method: 'POST',
    data,
  });
}

// 编辑客户联系人
export async function updataCustomerContact(customerId: string, contactId: string, data: Partial<CustomerContactListItem>) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/${contactId}/modify`, {
    method: 'PUT',
    data,
  });
}

// 查询单个客户联系人
export async function getCustomerContactInfo(contactId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/contacts/${contactId}/query`);
}

// 联系人列表
export async function getCustomerContactsList(customerId: string, params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 我的联系人列表
export async function getMyCustomerContactsList(customerId: string, params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/my-contacts/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 校验联系人手机号是否已存在
export async function checkPhone(customerId: string, phone: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/${phone}/exist`);
}

// 客户联系人授权查询
export async function checkOperateContactRight(customerId: string, contactId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/${contactId}/assignes/query`);
}

// 解密客户联系人手机号
export async function decryptPhoneNumber(customerId: string, contactId: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/${contactId}/decrypt`, {
    method: 'POST',
  });
}

// 分配客户联系人
export async function assignCustomerContacts(customerId: string, data: AssignContactsParams) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/contacts/assignes/create`, {
    method: 'POST',
    data,
  });
}

// 客户敏感信息解密 /mgmt/v1/customers/{customerId}/sensitives/decrypt
export async function decryptSensitives(customerId: string, decryptString: string) {
  return requestWithToken(`/api/bdpmis/v1/customers/${customerId}/sensitives/decrypt`, {
    method: 'POST',
    data: {
      decryptString,
    }
  });
}