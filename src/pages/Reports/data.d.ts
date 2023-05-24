export interface DrugInfoItem {
  productId: string;
  productCode: string; // 药品编号
  productName: string; // 药品名称
  specification: string; // 规格
  manufacturerName: string; // 生产企业
  approvalNumber: string; // 批准文号
  internationalBarCode: string; // 国际条码
  manufacturerName: string; // 生产企业
  drugLicenseHolder: string; // 上市许可持有人
}

export interface SalesReportsListItem extends DrugInfoItem {
  id: string;
  province: string; // 省
  city: string; // 市
  hospital: string; // 医院
  department: string; // 科室
  scanning_Count: number; // 扫码开方数
  doctor_Count: number; // 医生开方数
  autonomy_Count: number; // 自主开方数
  unique_Count: number; // 独立用户数
  sales_Count: number; // 销售数量
  sales_Price: number; // 销售金额
  saleTime: string;
}

export interface UsersReportsListItem extends DrugInfoItem {
  id: string;
  scanning_Count: number; // 扫码开方数
  doctor_Count: number; // 医生开方数
  autonomy_Count: number; // 自主复方数
  box_Count: number; // 盒数
  buyer_Count: number; // 购买人数
  new_Count: number; // 新用户数
  rebuy1Count: number; // 1个月内复购人数
  rebuy3Count: number; // 3个月内
  rebuy6Count: number; // 半年内
  rebuy12Count: number; // 一年内
  rebuyOver12Count: number; // 一年以上
  saleTime: string;
}

export interface InquiryReportsListItem {
  id: string;
  province: string; // 省
  city: string; // 市
  hospital: string; // 医院
  department: string; // 科室
  consultation_Count: number; // 问诊次数
  visits_Count: number; // 接诊次数
  afterConsultation_Count: number; // 问诊后开方人数
  afterConsultation_Price: number; // 问诊开方金额
  totalAmount: number; // 合计金额
  inquiryTime: string; // 问诊时间
}

export interface AuthorizationListItem {
  dataAuthorizationId: string; // 记录标识
  authorizedUserId: string; 
  authorizedUserName: string; // 授权对象
  authorizedRegion: string[]; // 授权地区
  authorizedProduct: string[]; // 授权品种
  authorizedStatus: number; // 状态
  lastModifiedBy: string; // 最近操作人
  lastModified: string; // 最近修改时间
}

export interface ModifyStatusParams {
  dataAuthorizationIds: string[];
  authorizedStatus: number;
  reason?: string;
}

export interface DrugInfoSearchParams { 
  productId: number;
  productName: string;
  manufacturerName: string;
}