/**
 * 统一使用后端配置的枚举值
 * 1、在此配置对应的枚举名
 * 2、使用的时候获取全局枚举值globalEnumsList
 * 3、调用changeEnumsListToObj方法获取对应的枚举值list并转为枚举对象
 * */
// 枚举名
export const enumNames = {
  /**
   * 审批
   * */ 
  APPROVAL_STATUS: 'approvalStatusEnum', // 审批状态
  FLOW_NODE_TYPE: 'nodeTypeEnum', // 审批流节点类型
  CONTEXT_TYPE: 'FlowInstanceFormContextTypeEnum', // 审批类型
  AUTHORIZED_STATUS_ENUM: 'AuthorizedStatusEnum', //  授权数据状态 
}
