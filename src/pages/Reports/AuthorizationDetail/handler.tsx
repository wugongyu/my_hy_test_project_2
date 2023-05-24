import type { DrugInfoItem, DrugInfoSearchParams } from "../data";

/** 字符串的校验（模糊匹配） */
export const searchRegExp = (searchParams: {
  dataSource: DrugInfoItem[],
  fieldName: string,
  params: Partial<DrugInfoSearchParams>,
}): DrugInfoItem[] => {
  const { dataSource, fieldName, params } = searchParams;
  if (!params[fieldName] && params[fieldName] !== 0) return [...dataSource];
  let filterDataSource: DrugInfoItem[] = [];
  filterDataSource = filterDataSource.concat(
    dataSource.filter(item => {
      if (`${item[fieldName]}`.search(`${params[fieldName]}`) !== -1) {
        return true;
      }
      return false;
    }),
  );
  return filterDataSource;
};

/** 完全字符串匹配的校验 */
export const perfectMatch = (searchParams: {
  dataSource: DrugInfoItem[],
  fieldName: string,
  params: Partial<DrugInfoSearchParams>,
}): DrugInfoItem[] => {
  const { dataSource, fieldName, params } = searchParams;
  if (!params[fieldName] && params[fieldName] !== 0) return [...dataSource];
  let filterDataSource: DrugInfoItem[] = [];
  const fetchParams = params[fieldName].replace(/(^\s*)|(\s*$)/g, '');
  filterDataSource = filterDataSource.concat(
    dataSource.filter(item => {
      if (fetchParams === item[fieldName]?.toString()) {
        return true;
      }
      return false;
    }),
  );
  return filterDataSource;
};

/**
 * 条件筛选函数
 * list: 列表数据
 * params: 筛选条件数据
 * searchKeys：筛选条件的key值
 */
 export const handleSearchTableData = (searchParams: {
  list: DrugInfoItem[],
  params: Partial<DrugInfoSearchParams>,
  searchKeys?: string[],
 }): DrugInfoItem[] => {
  const initSearchKeys: string[] = [
    'productId', // 商品编码
    'productName', // 商品名称
    'manufacturerName', // 生产企业
  ];
  const { list, params, searchKeys = initSearchKeys } = searchParams;
  let dataSource = [...list];
  // 完全匹配的字段
  const perfectMatchProps: string[] = [
    'productId', // 商品编码
  ];

  searchKeys.forEach(key => {
    if (perfectMatchProps.indexOf(key) !== -1) {
      // 完全匹配
      dataSource = perfectMatch({ dataSource: [...dataSource], fieldName: key, params });
    } else {
      // 模糊匹配
      dataSource = searchRegExp({ dataSource: [...dataSource], fieldName: key, params });
    }
  });
  return dataSource;
};