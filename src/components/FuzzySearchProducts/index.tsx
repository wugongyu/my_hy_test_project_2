/**
 * 模糊查询商品组件（下拉框内容自定义）
 * */
import { Empty, Select, Spin } from 'antd';
import type { SelectValue } from 'antd/lib/select';
import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import styles from './index.less';
// import { getProductsBySearchParams } from '@/services/common';

export interface SingleSelectValue {
  label: any;
  value: any;
  [key: string]: any;
}

interface CommonFuzzySearchProductsProps {
  value?: SelectValue | SingleSelectValue; // 选中值
  onChange?: (val: SelectValue | SingleSelectValue) => void; // 选中选项时的回调
}

const CommonFuzzySearchProducts: React.FC<CommonFuzzySearchProductsProps> = (props) => {
  const { value, onChange } = props;
  const [currentOptions, setOptions] = useState<(SingleSelectValue | SelectValue)[]>([]); // 当前选项数据
  const [fetching, setFetching] = useState<boolean>(false);
  // 获取数据
  const fetchList = async (v: string) => {
    const params = {
      current: 1,
      pageSize: 20,
      searchParam: v,
    };
    console.log(params);
    // const response = await getProductsBySearchParams(params);
    const response = {
      data: [],
    };
    if (response && Array.isArray(response.data)) {
      const handledData = response?.data?.map((item: any) => ({
        ...item,
        value: item.productId,
        label: item.productName,
      }));
      setOptions(handledData);
    } else {
      setOptions([]);
    }
  };
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
    if (selectedVal && onChange) {
      onChange(selectedVal);
    }
  };
  const handleClear = () => {
    if (onChange) {
      onChange(undefined);
    }
  };
  const displayContent = {
    0: [
      {
        label: '商品编码',
        key: 'productId',
      },
      {
        label: '国际条码',
        key: 'barCode',
      },
      {
        label: '批准文号',
        key: 'approvalNumber',
      },
    ],
    1: [
      {
        label: '商品名称',
        key: 'productName',
      },
      {
        label: '规格',
        key: 'packing',
      },
      {
        label: '型号',
        key: 'unit',
      },
    ],
  };
  return (
    <div>
      <Select
        showSearch
        placeholder="输入关键字搜索"
        notFoundContent={
          fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        style={{ minWidth: 200 }}
        value={value}
        allowClear
        onClear={() => handleClear()}
        optionLabelProp="label"
        dropdownMatchSelectWidth={300}
      >
        {currentOptions?.map((d: any) => (
          <Select.Option
            title={d?.label}
            key={d.value}
            value={d.value}
            label={d.label}
            id={d.value}
          >
            <div className={styles.fuzzySearchProductsContentBox}>
              {Object.keys(displayContent)?.map((k) => (
                <div className={styles.flexContent} key={k}>
                  {Array.isArray(displayContent[k]) &&
                    displayContent[k]?.map((item: { key: string; label: string }) => (
                      <p key={item.key}>
                        <span className={styles.contentTitle}>{item.label}</span>
                        <span className={styles.contentValue}>{d[item.key]}</span>
                      </p>
                    ))}
                </div>
              ))}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default CommonFuzzySearchProducts;
