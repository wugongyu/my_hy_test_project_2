// 查询表格数据参数
export interface CommonTableListParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}
// 路由的参数
export interface MatchDataProps {
  params: Record<string, any>;
  path: string;
  url: string;
}

export interface RegionParams {
  label: string;
  value?: string;
  key: string;
}
export interface RegionDataProps {
  province: RegionParams;
  city: RegionParams;
  county: RegionParams;
}

export interface EnumValue {
  name: string;
  value: number;
  desc: string;
}

export interface CommonEnumsProps {
  enumName: string;
  enumValue: EnumValue[];
}