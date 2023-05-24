// 审批内容
export interface ApprovalComments {
  comment: string,
  handler?: string, // 当前节点操作人
  approvalTime?: string,
}
// 审批工作流程模板内容
export interface SchemeContent {
  id: string;
  approvalComments: ApprovalComments[],
  fromNodeStep: number;
  toNodeStep: number;
  nodeType: number;
  nodeName: string;
  nodeDesignateType: number;
  nodeRejectType: number;
  nodeApprovalType: number;
  nodeDesignates: string[];
}

// 审批工作流实例
export interface ApprovalListItem {
  approvalCode: string; // 审批单号
  schemeName: number; // 类型 (流程模板名称)
  instanceName: string; // 流程实例名称
  createUserName: string; // 申请人
  createUserId: string; // 申请人id
  creationDate: string; // 申请时间
  activityName: string; // 当前进度（当前审批节点名称）
  instanceStatus: number; // 审批状态（流程实例状态）
  instanceId: string;
  lastModified: string;
  schemeCode: string;
  schemeContent: SchemeContent[];
  instanceCode: string;
  activityNodeStep: number;
  activityType: number;
  previousNodeStep: number;
  formContext: string;
  makerList: string;
}
// 工作流实例审批记录
export interface OperateHistoryListItem {
  instanceId: string;
  createUserId: string;
  createUserName: string;
  currentNodeStep: number;
  currentNodeType: number;
  currentNodeName: string;
  approvalComments: string;
  approvalTime: string;
}

export interface AuditParams {
  instanceId: string;
  [key: string]: any;
}