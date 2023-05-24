export interface StatisticCountsParams {
  warehouseId?: string;
}

export interface ChangeOrderPasswordParams {
  warehouseId?: string;
  password: string;
  oldPassword: string;
}