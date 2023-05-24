import { requestWithToken } from "@/utils/request";
import type { CommonTableListParams } from "./data";

// 异步加载部门树
export async function getEmployeeInformation(params: {
  departmentId?: string
}) {
  return requestWithToken(`/api/permission/v1/search/departments/trees/query`, {
    params,
  });
}

// 模糊查询部门成员信息
export async function searchDepartmentMembers(params: CommonTableListParams) {
  const { current, pageSize, ...rest } = params;
  return requestWithToken(`/api/permission/v1/search/accounts/${current}/${pageSize}/query`, {
    params: {
      ...rest,
    },
  });
}

// 获取通用日志接口
export async function getCommonLogs(params: CommonTableListParams) {
  const { current, pageSize, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/commonLogs/${current}/${pageSize}/query`, {
    params: {
      ...rest,
    },
  });
}

// 获取工作流枚举
export async function getWorkFlowEnums() {
  return requestWithToken(`/api/workflow/v1/system/enums/query`);
}

// 获取系统枚举 
export async function getGlobalEnums() {
  return requestWithToken(`/api/bdpmis/v1/system/enums/query`);
}

// 根据用户id，查询用户相关信息
export async function getUserInfos(accountString?: string) {
  return requestWithToken(`/api/permission/v1/accounts/query`, {
    params: {
      accountString,
    }
  });
}

// 地区区域查询接口[联动查询]
export async function getRegionals(parentCode: string = '0') {
  return requestWithToken(`/api/bdpmis/v1/regionals/subordinates/query`, {
    params: {
      parentCode,
    }
  });
}


// 搜索商品档案
export async function getProductsList(params: CommonTableListParams) {
  const { current, pageSize, ...rest } = params;
  return requestWithToken(`/api/bdpmis/v1/searches/products/${current}/${pageSize}/query`, {
    params: {
      ...rest,
    },
  });
}

// 导入失败文件的下载
export async function exportFailFile(failFileKey: string) {
  return requestWithToken(`/api/bdpmis/v1/files/import-fail-files/${failFileKey}/down`, {
   responseType: 'blob',
  });
}