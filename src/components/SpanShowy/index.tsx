import { lowerCase } from 'lodash';
import React, { useState } from 'react';

interface StyleObjectProps {
  [key: string]: any;
}

export interface SpanShowyProps {
  type?: string; // 显示类型
  color?: string; // 显示颜色，颜色优先于类型
  label?: string | React.ReactNode; // 文字
  size?: number; // 文字大小
  weight?:
    | number
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | 'bold'
    | 'normal'
    | 'bolder'
    | 'lighter'; // 加粗大小
  styleObject?: StyleObjectProps;
  maxSize?: number; // 文字鼠标移入大小
  abledSize?: boolean; // 禁用大小变化
}

const SpanShowy: React.FC<SpanShowyProps> = props => {
  const {
    label,
    color,
    type,
    size = 14,
    weight = 'unset',
    styleObject,
    maxSize = 16,
    abledSize,
  } = props;

  const [currentSize, setCurrentSize] = useState<number>(size);

  const typehandle = (val?: string) => {
    if (!val) return '';
    let typeColor: string = '';
    switch (lowerCase(val)) {
      case 'primary':
        typeColor = '#1890ff';
        break;
      case 'processing':
        typeColor = '#33CCCC';
        break;
      case 'success':
        typeColor = '#52c41a';
        break;
      case 'warning':
        typeColor = '#faad14';
        break;
      case 'error':
        typeColor = '#ff0000';
        break;
      default:
        break;
    }
    return typeColor;
  };

  const handleEnter = () => {
    if (!abledSize) return;
    setCurrentSize(maxSize);
  };

  const handleLeave = () => {
    if (!abledSize) return;
    setCurrentSize(size);
  };

  return (
    <span
      style={{
        color: color || typehandle(type) || '#000000a6',
        fontSize: currentSize,
        fontWeight: weight,
        ...styleObject,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {label}
    </span>
  );
};

export default SpanShowy;
