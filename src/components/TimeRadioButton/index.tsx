import React, { useState, useEffect } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, DatePicker } from 'antd';
import styles from './index.less';
import type { Moment } from 'moment';

export interface TimeRadioOptionsProps {
  label: string;
  value: string;
}

export interface TimeRadioProps {
  onChange?: (value: string | Moment[]) => void; // 值改变的触发函数
  value?: string | Moment[]; // 选中值
  defaultValue?: number; // 默认值
  options?: Record<string, TimeRadioOptionsProps>; // 设置项
  optionType?: 'default' | 'button';
  buttonStyle?: 'outline' | 'solid';
  isShowCustomerOption?: boolean; // 是否可自定义输入
}

const { RangePicker } = DatePicker;

// 默认值项
export const defaultOptions: Record<string, TimeRadioOptionsProps> = {
  yestoday: {  value: '1', label: '昨天' },
  recentThreeDays: { value: '3', label: '近3天' },
  recentSevenDays: { value: '7', label: '近7天' },
  recentThirtyDays: { value: '30', label: '近30天' },
  recentNinetyDays: { value: '90', label: '近90天' },
  customer: { value: 'customer', label: '自定义' },
};

const customerVal = defaultOptions.customer.value;

const TimeRadioButton: React.FC<TimeRadioProps> = props => {
  const {
    onChange,
    value: outValue,
    options,
    defaultValue = defaultOptions.yestoday.value,
    optionType = 'button',
    buttonStyle = 'solid',
    isShowCustomerOption = false,
  } = props;
  const [optionsVal, setOptionsVal] = useState<Record<string, TimeRadioOptionsProps>>(
    options || defaultOptions,
  );
  const [radioVal, setRadioVal] = useState<string | undefined>(props.defaultValue?.toString());
  const [otherVal, setOtherVal] = useState<any>();

  useEffect(() => {
    if (options?.length) {
      setOptionsVal(options);
    } else {
      setOptionsVal(defaultOptions);
    }
  }, [options]);

  useEffect(() => {
    if (outValue && Object.keys(optionsVal).length > 0) {
      const findIndex = Object.keys(optionsVal).findIndex(k => optionsVal[k]?.value === outValue?.toString());
      if (findIndex !== -1) {
        setRadioVal(outValue?.toString());
      } else {
        setRadioVal(customerVal);
        setOtherVal(outValue);
      }
    }
  }, [outValue, optionsVal]);

  const handleChange = (e: RadioChangeEvent) => {
    const currentVal = e.target.value;
    setRadioVal(currentVal);
    // 如果点击的是customerVal的值，先设置为undefined, 在日期选择框中改变时再调用onChange赋值
    if (onChange) {
      onChange(currentVal !== customerVal ? currentVal : undefined);
    }
  };

  const handleDatePickerChange = (date: any) => {
    setRadioVal(customerVal);
    setOtherVal(date);
    if (!onChange) return;
    onChange(date);
  };
  return (
    <Radio.Group
      onChange={handleChange}
      value={radioVal || defaultValue}
      className={styles.radioGroupStyle}
      optionType={optionType}
      buttonStyle={buttonStyle}
    >
      {(isShowCustomerOption ? Object.keys(optionsVal) : Object.keys(optionsVal)?.filter(k => k !== 'customer')).map(k => (
        <Radio type='button' value={optionsVal[k].value} key={optionsVal[k].value}>
          {optionsVal[k].label}
        </Radio>
      ))}
      {radioVal === customerVal && (
      <>
      <RangePicker 
        value={otherVal}
        onChange={handleDatePickerChange}
        />
      </>
    )}
    </Radio.Group>
  );
};

export default TimeRadioButton;
