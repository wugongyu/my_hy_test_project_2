import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import Styles from './index.less';
import type { GlobalEnumListItem } from './data';

const { CheckableTag } = Tag;

export interface CheckableTagGroupProps {
  valueEnum: Record<string, GlobalEnumListItem>; // tag选项枚举值
  value?: string[]; // 选中值
  onChange?: (val?: string[]) => void; // 选中改变回调
  [key: string]: any;
}

const CheckableTagGroup: React.FC<CheckableTagGroupProps> = props => {
  const { valueEnum = [], value = [], onChange } = props;

  const allValue = 'all';

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getAllKeys = () => {
    const allKeys: string[] = [allValue];
    Object.keys(valueEnum).forEach(k => {
      allKeys.push(k);
    });
    return allKeys;
  };

  useEffect(() => {
    const allKeys: string[] = getAllKeys();
    if (value.indexOf(allValue) !== -1 || allKeys.length - 1 === value?.length) {
      setSelectedTags(allKeys);
    } else {
      setSelectedTags([...value]);
    }
  }, [value]);
  const change = (val: string[]) => {
    if (onChange) {
      const filterVal = val.filter(item => item !== allValue);
      onChange(filterVal);
    } else {
      setSelectedTags(val);
    }
  };

  const handleChange = (key: string, checked: boolean) => {
    const allKeys: string[] = getAllKeys();
    if (key === allValue && checked) {
      // 全选
      change([...allKeys]);
      return;
    }
    if (key === allValue && !checked) {
      // 全取消
      change([]);
      return;
    }
    if (selectedTags.length === allKeys.length && !checked) {
      // 全选状态下，取消其中一个勾选
      change([...selectedTags.filter(item => item !== key && item !== allValue)]);
      return;
    }
    const selectVals: string[] = checked
      ? [...selectedTags, key]
      : selectedTags.filter(item => item !== key);
    if (selectVals.length === allKeys.length - 1) {
      // 除了全选未勾选，默认全选也勾上
      selectVals.push(allValue);
    }
    change(selectVals);
  };

  return (
    <div className={Styles.CheckableTagGroupStyle}>
      <CheckableTag
        key={allValue}
        checked={selectedTags.indexOf(allValue) > -1}
        onChange={checked => handleChange(allValue, checked)}
      >
        全部
      </CheckableTag>
      {Object.keys(valueEnum).map((k) => (
        <CheckableTag
          key={k}
          checked={selectedTags.indexOf(k) > -1}
          onChange={checked => handleChange(k, checked)}
        >
          {valueEnum[k]?.text || ''}
        </CheckableTag>
      ))}
    </div>
  );
};

export default CheckableTagGroup;
