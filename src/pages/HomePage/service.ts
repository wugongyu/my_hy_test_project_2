import { requestWithToken } from "@/utils/request";
import { handleParamsFilterNull } from "@/utils/utils";
import type { ChangeOrderPasswordParams, StatisticCountsParams } from "./data";

// 今日订单数量
export async function queryTodayOrderCounts(params: StatisticCountsParams) {
  const filterParams = handleParamsFilterNull(params);
  return requestWithToken(`/api/erp/v1/sale-order/query-today-sales`, {
    params: filterParams,
  });
}

// 昨日订单数量
export async function queryYestodayOrderCounts(params: StatisticCountsParams) {
  const filterParams = handleParamsFilterNull(params);
  return requestWithToken(`/api/erp/v1/sale-order/query-yesterday-sales`, {
    params: filterParams,
  });
}

// 待发货数量
export async function queryAwaitDeliveryCounts(params: StatisticCountsParams) {
  const filterParams = handleParamsFilterNull(params);
  return requestWithToken(`/api/erp/v1/sale-order/query-outbound-count`, {
    params: filterParams,
  });
}

// 退货数量
export async function queryReturnOrderCounts(params: StatisticCountsParams) {
  const filterParams = handleParamsFilterNull(params);
  return requestWithToken(`/api/erp/v1/sale-order/query-outbound-return-count`,{
    params: filterParams,
  });
}

// 当前用户修改落单密码
export async function changeOrderPassword(data: ChangeOrderPasswordParams) {
  return requestWithToken(`/api/erp/v1/base-employee/order-password/modify`,{
    method: 'POST',
    data,
  });
}