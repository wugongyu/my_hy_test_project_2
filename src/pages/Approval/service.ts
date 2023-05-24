/**
 * 审批
 * */
import type { CommonTableListParams } from "@/services/data";
import { requestWithToken } from "@/utils/request";
import { handleParamsFilterNull } from "@/utils/utils";
import { AuditParams } from "./data";

 

// 所有审批单查询
export async function getAllInstancesList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 我申请的审批单查询
export async function getMyApplyInstancesList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/my-instances/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 待我审批的审批单查询
export async function getMyWaitingAppproveInstancesList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/my-approving-instances/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}

// 我已审批的审批单查询
export async function getMyAppprovedInstancesList(params: CommonTableListParams) {
  const { pageSize, current, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/my-approved-instances/${current}/${pageSize}/query`, {
    params: handleParamsFilterNull(rest),
  });
}


// 获取当前审批流程记录
export async function getApprovalProcess(instanceId: string) {
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/query`);
}

// 获取当前审批流的审批记录
export async function getApprovalOperationHistories(instanceId: string) {
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/operation-histories/query`);
}

// 审批通过接口
export async function passAudit(params: AuditParams) {
  const { instanceId, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/approve`, {
    method: 'POST',
    data: rest,
  })
}

// 审批驳回
export async function rejectAudit(params: AuditParams) {
  const { instanceId, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/refusal`, {
    method: 'POST',
    data: rest,
  });
}

// 审批通知
export async function approvalNotify(instanceId: string) {
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/notify`, {
    method: 'POST',
  });
}

// 审批撤销
export async function revokeApproval(params: any) {
  const { instanceId, ...rest } = params;
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/reCall`, {
    method: 'POST',
    data: rest,
  });
}

// 审批提交（启动审批）
export async function submitApproval(params: { instanceId: string, description?: string }) {
  const { instanceId, ...rest } = params;
  const handledParams = handleParamsFilterNull(rest);
  return requestWithToken(`/api/workflow/v1/instances/${instanceId}/start`, {
    method: 'POST',
    data: handledParams,
  });
}