
import type { CommonTableListParams } from "@/services/data";
import { requestWithToken } from "@/utils/request";
import { handleParamsFilterNull } from "@/utils/utils";
import type { AuthorizationListItem, ModifyStatusParams } from "./data";

/**
 * 报表
 * */

// 销售报表
export async function getSaleReportsList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/reports/sales/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 用户报表
export async function getUserReportsList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/reports/users/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 问诊报表
export async function getInquiryReportsList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/reports/consultations/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

/**
 * 数据授权
 * */ 

// 获取数据授权列表
export async function getAuthorizaitonsList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 获取单个数据授权信息
export async function getAuthorizaitonInfo(dataAuthorizationId: string) {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/${dataAuthorizationId}/query`);
}

// 新增数据授权
export async function createDataAuthorization(data: Partial<AuthorizationListItem>) {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/create`, {
    method: 'POST',
    data,
  });
}

// 编辑数据授权
export async function modifyDataAuthorization(dataAuthorizationId: string, data: Partial<AuthorizationListItem>) {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/${dataAuthorizationId}/modify`, {
    method: 'PUT',
    data,
  });
}

// 编辑数据授权的状态
export async function modifyDataAuthorizationStatus(data: ModifyStatusParams) {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/batch-modify-status`, {
    method: 'PUT',
    data,
  });
}

// 获取授权商品信息/mgmt/v1/products/query
export async function getAuthorizedProductsInfo(productString: string) {
  return requestWithToken(`/api/bdpmis/v1/products/query`, {
    params: {
      productString,
    },
  });
}

// 授权商品导入模板下载/mgmt/v1/data-authorizations/products/import-template/down
export async function importAuthorizedProductsTemplate() {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/products/import-template/down`,
    {
      responseType: 'blob',
    }
  );
}

// 授权商品导入/mgmt/v1/data-authorizations/{authorizedUserId}/products/import
export async function batchImportAuthorizedProducts(dataAuthorizationId: string | number, formData: FormData) {
  return requestWithToken(`/api/bdpmis/v1/data-authorizations/${dataAuthorizationId}/products/import`, {
    method: 'POST',
    data: formData,
  });
}