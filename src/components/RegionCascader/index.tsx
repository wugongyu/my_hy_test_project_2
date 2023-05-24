/**
 * 地区级联选择组件
 * */ 

import { getRegionals } from '@/services/global';
import { Cascader } from 'antd';
import { useEffect, useState } from 'react';

export interface RegionCascaderProps {
  value?: RegionOptionsProps[];
  onChange?: (val?: RegionOptionsProps[]) => void;
  initOptions?: RegionOptionsProps[];
  isOnlyProvinceAndCity?: boolean; // 是否只提供省、市的选项
  isOnlyProvice?: boolean; // 是否只提供省的选项
}

export interface RegionOptionsProps {
  value: string;
  label: string;
  isLeaf?: boolean;
  loading?: boolean;
  children?: RegionOptionsProps[];
};

export const fetchRegionalOptions = async(params: {code?: string, isLeaf?: boolean}) => {
  const { code, isLeaf } = params;
  const res = await getRegionals(code);
  const handleOptions: RegionOptionsProps[] = []
  if(res && Object.keys(res).length > 0) {
    Object.keys(res).forEach(k => {
      if(typeof Number(k) === 'number') {
        const areaObj = {
          value: k,
          label: res[k],
          isLeaf: isLeaf || k.slice(-2) !== '00', // 末尾两位不等于'00'的即为叶子节点
        };
        handleOptions.push(areaObj);
      }
    })
  }
  return handleOptions;
}
// 初始化区域选项
export const handleInitOptionsData = async(value: RegionOptionsProps[]) => {
  if(value && value?.length > 0) {
    const resData = await fetchRegionalOptions({});
    const optionsTemp = [...resData];
    if(value[0]) {
      const secondOptions = await fetchRegionalOptions({code: value[0].value});
      const findTargetIndex = optionsTemp?.findIndex(item => item.value === value[0].value);
      if(findTargetIndex !== -1) {
        if(value[1]) {
          const thirdOptions = await fetchRegionalOptions({code: value[1].value});
          const findThirdTargetIndex = secondOptions?.findIndex(item => item.value === value[1].value);
          if(findThirdTargetIndex !== -1) {
            secondOptions.splice(findThirdTargetIndex, 1, {
              ...secondOptions[findThirdTargetIndex],
              children: thirdOptions,
            });
          }
        }
        optionsTemp.splice(findTargetIndex, 1, {
          ...optionsTemp[findTargetIndex],
          children: secondOptions,
        });
      }
    }
    return optionsTemp;
  }
  return [];
} 

const RegionCascader: React.FC<RegionCascaderProps> = (props) => {
  const { value, onChange, initOptions, isOnlyProvinceAndCity = false, isOnlyProvice = false } = props;
  const [options, setOptions] = useState<RegionOptionsProps[]>([]);

  useEffect(() => {
    if(initOptions) {
      setOptions(initOptions);
    }
  }, [initOptions]);

  const fetchRootRegions = async() => {
    const resData = await fetchRegionalOptions({isLeaf: isOnlyProvice});
    setOptions(resData);
  }
  useEffect(() => {
    fetchRootRegions();
  }, []);

  const handleChange = (val: any, selectedOptions: any) => {
    if(onChange) {
      onChange(selectedOptions);
    }

  };

  const loadData = async(selectedOptions: string | any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const resData = await fetchRegionalOptions({code: targetOption?.value, isLeaf: isOnlyProvinceAndCity});
    targetOption.children = [
      ...resData,
    ];
    targetOption.isLeaf = resData?.length === 0; // 如果返回的下一级节点为空，则判断当前节点为叶子节点
    setOptions([...options]);
    targetOption.loading = false;
  };

  return <Cascader value={value?.map((item: { value: string; }) => item.value)} options={options} loadData={loadData} onChange={handleChange} changeOnSelect />;
};

export default RegionCascader;