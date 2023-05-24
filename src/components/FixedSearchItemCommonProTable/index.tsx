/**
 * 指定区域（查询项区域（默认）、table下方的操作区域（需传参bottomContentId））固定在页面可视区域的protable组件
 * (屏幕高度适配)
 * */ 
import { getTableScroll } from '@/utils/utils';
import type { ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useState, useEffect } from 'react';

export interface FixedSearchItemProTableProps extends ProTableProps<any, any> {
  id: string; // table的唯一标识(必需)
  bottomContentId?: string; // table下方元素的id
  extraHeight?: number;
  isAddTableMinHeight?: boolean; // 是否给表格tablebody加上最小高度
  [key: string]: any;
};

const FixedSearchItemProTable: React.FC<FixedSearchItemProTableProps> = (props) => {
  const { scroll, id, bottomContentId, extraHeight, isAddTableMinHeight = false,  ...restProps } = props;
  const [scrollY, setScrollY] = useState<string | number>("");
  // 页面加载完成后才能获取到对应的元素及其位置
  useEffect(() => {
    if(id) {
      const currentExtraHeight = bottomContentId ? document.getElementById(bottomContentId)?.getBoundingClientRect().height : undefined;
      const currentY = getTableScroll(id, extraHeight || currentExtraHeight);
      setScrollY(currentY);
      if(isAddTableMinHeight) {
        const tableItem = document.getElementById(id);
        const tableBodyItem: any = tableItem?.getElementsByClassName('ant-table-body')[0];
        if(tableBodyItem) {
          tableBodyItem.style.minHeight = currentY;
        }
      }
    }
  }, [id, bottomContentId, extraHeight, isAddTableMinHeight]);
  return (
    <>
      <ProTable 
        id={id}
        {
          ...restProps
        }
        scroll={{
          ...scroll,
          y: scrollY,
        }}
      />
    </>
  );
}

export default FixedSearchItemProTable;