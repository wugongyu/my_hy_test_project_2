export interface customerStatisticsProps {
  contactNum: number; // 联系人数量
}
export interface CustomerListItem {
  customerCode: string; // 客户编号
  customerId: string; // 客户标识
  customerShortName: string; // 客户简称
  customerName: string; // 客户全称
  customerStatistics: customerStatisticsProps; // 联系人数
  lastModifiedBy: string; // 最近操作人
  lastModified: string; // 最近修改时间
  establishedTime: string; // 成立日期
  contact: string; // 联系电话
  provinceCode: string; // 省(直辖市)编码
  provinceName: string;
  cityCode: string; // 市编码
  cityName: string;
  townshipCode: string; // 区(县)编码
  townshipName: string;
  townCode: string; // 乡镇(街道)编码
  townName: string;
  address: string; // 详细地址
  assigneeId: string; // 归属销售id
  assigneeName: string; // 销售名
}

export interface Department {
  departmentId: string;
  departmentName: string;
}
export interface CustomerContactListItem extends Partial<CustomerListItem> {
  uid: string;
  contactId: string;
  contactName: string; // 联系人姓名
  mobilePhone?: string; // 联系人手机
  position: string; // 联系人职位
  departmentId: string; // 部门
  departmentName: string; // 部门名
  sex: number; // 性别
  email: string; // 联系人邮箱
  duty: string; // 主要职责
  address: string; // 联系人地址（所在城市）
  assignees: Assignee[];
  departments: Department[];
  departmentIds: string[];
}

export interface Assignee {
  assigneeId: string;
  assigneeName: string;
}

export interface AssignCustomerParams {
  customerIds: string[];
  assignees: Assignee[];
}

export interface AssignContactsParams {
  contactIds: string[];
  assignees: Assignee[];
}
export interface CustomerDepartmentItem {
  customerId: string;
  departmentCode: string; // 部门编码
  departmentName: string; // 部门名称
  parentDepartmentId: string; // 父级部门标识
}

export interface RecycleAssignmentParams {
  customerId?: string;
  assigneeId?: string;
  contactId?: string;
}

export interface AssigneeItem {
  id: number;
  creationDate: string;
  lastModified: string;
  recordState: number;
  customerId: string;
  contactId: string;
  assigneeId: string;
  assigneeName: string;
}