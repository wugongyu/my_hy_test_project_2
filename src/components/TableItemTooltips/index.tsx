/**
 * 表格中的相关字段文案超长省略，
 * 且鼠标移入出现提示框，展示全部文案
 *
 * */

import { Tooltip } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import styles from './index.less';

export interface TableItemTooltipsProps {
  showTextArr?: string[]; // 直接展示的文案数组
  tableRecord: Record<string, any>; // 表格当前操作行数据
  keyArr?: string[]; // 需展示的字段数组（多个字段需要同一行展示---用“|”拼接key值）
  valueWidth?: number; // 字段值的长度
  valueLabel?: string[]; // 需展示的字段名
  labelWidth?: number; // 需展示的字段名的长度
  concatText?: string; // 拼接展示的字符
  showLineCounts?: number; // 展示的行数
}

const showLineCountsRender = (lineCounts: number = 1) => {
  return {
    'overflow': 'hidden',
    'textAlign': 'left',
    'textOverflow': 'ellipsis',
    'display': '-webkit-box', 
    'WebkitBoxOrient': 'vertical',
    'WebkitLineClamp': `${lineCounts}`,
  };
};

const TableItemTooltips: React.FC<TableItemTooltipsProps> = props => {
  const { tableRecord, keyArr, valueWidth, valueLabel, labelWidth, concatText = '/',
    showTextArr = [], showLineCounts = 1 } = props;
  const finalValueWidth = tableRecord ? 150 : 50;
  const finalLabelidth = labelWidth || 50;
  const currentLineClampStyle = {
    ...showLineCountsRender(showLineCounts)
  }
  const keyItemRender = (k: string, i: number) => {
    if (!k) return null;
    // 判断多个字段是否需要同一行展示
    const splitKeys = k?.split('|');
    let showText = '';
    if (splitKeys?.length > 1) {
      splitKeys?.forEach((splitK, index) => {
        if (index < splitKeys?.length - 1) {
          showText += `${tableRecord[splitK] || '--'}${concatText}`;
        } else {
          showText += `${tableRecord[splitK] || '--'}`;
        }
      });
    } else {
      showText = tableRecord[k] || '-';
    }
    return (
      <div key={k}>
        <p className={styles.listInfoItem}>
          {valueLabel && valueLabel[i] && (
            <Tooltip key={k} title={valueLabel[i]}>
              <span style={{ width: finalLabelidth, ...currentLineClampStyle }}>
                {valueLabel[i]}：
              </span>
            </Tooltip>
          )}
          <Tooltip title={showText}>
            <span
              style={{ width: valueWidth || finalValueWidth, ...currentLineClampStyle }}
            >
              {showText}
            </span>
          </Tooltip>
        </p>
      </div>
    );
  };
  return <>
    {showTextArr?.length > 0 ? (<>
    {showTextArr?.map(item => (
     <Tooltip key={v4()} title={item}>
      <span style={{ width: valueWidth || finalValueWidth, ...currentLineClampStyle }}>
        {item}
      </span>
    </Tooltip>
    ))}
    </>) : <>{keyArr?.map((k, index) => keyItemRender(k, index))}</>}
  </>;
};

export default TableItemTooltips;
