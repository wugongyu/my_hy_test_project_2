/**
 * 模糊搜索通用组件
 * */ 

import React, { useState, useEffect } from 'react';
import { Empty, message, Select, Spin } from 'antd';
import type { SelectValue } from 'antd/lib/select';
import debounce from 'lodash/debounce';

export interface SingleSelectValue{
  label: any;
  value: any;
  [key: string]: any;
}

export interface FuzzySearchProps {
  value?: SelectValue | SingleSelectValue; // 选中值
  selectMode?: "multiple" | "tags" | undefined; // 设置select模式
  searchType: string; // 模糊搜索类型
  labelKey: string; // 选项label对应的属性
  valueKey: string; // 选项value对应的属性
  onChange?: (val: SelectValue  | SingleSelectValue) => void; // 选中选项时的回调
  labelInValue?: boolean;
  selectPlaceHolder?: string;
  allowClear?: boolean; // 是否可清空选项
  disabled?: boolean; // 下拉框是否禁用
  onHandleSelectedInfo?: (data: any) => void; // 选中某一个选项时的回调， data为选中的选项数据
  initOptions?: (SelectValue  | SingleSelectValue)[]; // 初始选项数据
  isResetOptions?: boolean; // 是否清空选项
  onIsReSetOptionsChange?: (flag: boolean) => void; // isResetOptions的回调函数
  otherParams?: Record<string, unknown>; // 其他的接口参数
  fuzzySearchKey?: string; // 搜索的关键字key 默认为“searchParam”
  [key: string]: any;
}

export const searchServiceApi = {
  customers: { key: 'customers', get: 'getCustomersByParams' }, // 客户
  customersContacts: { key: 'customersContacts', get: 'getCustomerContactsByParams' }, // 客户联系人
}

const FuzzySearch: React.FC<FuzzySearchProps> = (props) => {
  const { value, searchType, labelKey,
    valueKey, labelInValue = true, selectPlaceHolder, disabled = false,
    allowClear = true, selectMode = undefined,
    onChange, onHandleSelectedInfo, initOptions, otherParams, isResetOptions = false,
    onIsReSetOptionsChange, fuzzySearchKey = 'searchParam',
    ...restProps } = props;
  const [currentOptions, setOptions] = useState<(SingleSelectValue | SelectValue)[]>([]); // 当前选项数据
  const [fetching, setFetching] = useState<boolean>(false);
  useEffect(() => {
    if(initOptions && initOptions.length > 0) {
      setOptions(initOptions);
    }
  }, [initOptions]);
  useEffect(() => {
    if(isResetOptions) {
      setOptions([]);
      if(onIsReSetOptionsChange) {
        onIsReSetOptionsChange(false);
      }
    }
  }, [isResetOptions, onIsReSetOptionsChange])
  // 获取数据
  const fetchList = async(v: string) => {
    const params = {
      pageSize: 10,
      current: 1,
      [fuzzySearchKey]: v,
      ...otherParams,
    }
    if(searchType === 'customersContacts' && !otherParams?.customerId) {
      message.error('请先选择一个客户之后再选择联系人！');
      return;
    }
    const response = await searchServiceApi[searchType].get(params);
    if(response && response.data) {
      const handledData = response?.data?.map((item: any) => ({
        ...item,
        value: item[valueKey],
        label: item[labelKey],
      }));
      setOptions(handledData);
    } else {
      setOptions([]);
    }
  }

  // 搜索
  const handleSearch = debounce((v) => {
    setFetching(true);
    if (v) {
      fetchList(v);
    }
    setFetching(false);
  }, 800);
   // 选择
  const handleChange = (selectedVal: any) => {
    if(selectedVal && onChange) {
      onChange(selectedVal);
    }
    if(selectedVal && selectedVal?.value) {
      const findSelectedSupplierInfo = currentOptions?.find((item: any )=> item.supplierId === selectedVal?.value)
      if(findSelectedSupplierInfo && onHandleSelectedInfo) {
        onHandleSelectedInfo(findSelectedSupplierInfo);
      }
    }
  }
  const handleClear = () => {
    if(onChange) {
      onChange(undefined)
    }
  }
  return (
    <>
      <Select
        mode={selectMode}
        labelInValue={labelInValue}
        showSearch
        placeholder={selectPlaceHolder || '输入关键字搜索'}
        notFoundContent={
          fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        style={{ minWidth: 200 }}
        value={value}
        disabled={disabled}
        allowClear={allowClear}
        onClear={() => handleClear()}
        {...restProps}
      >
        {currentOptions?.map((d: any) => (
          <Select.Option title={d?.label} key={d.value} value={d.value} id={d.value}>
            {d?.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}

export default FuzzySearch;