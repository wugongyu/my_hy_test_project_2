import { commonPageExtraHeight } from "@/config/common";
import { useEffect, useState } from "react";
import styles from './index.less';

/**
 * 超出可视化高度，元素滚动
 * */ 
interface ScrollableItemProps {
  id: string; // 元素的唯一标识(必需)
  bottomContentId?: string; // 下方元素的id
  extraHeight?: number;
  className?: string;
}
const ScrollableItem: React.FC<ScrollableItemProps> = (props) => {
  const { id, bottomContentId, extraHeight, children, className } = props;
  const [treeHeight, setHeight] = useState<string>('350px');
  useEffect(() => {
    const currentExtraHeight = bottomContentId ? document.getElementById(bottomContentId)?.getBoundingClientRect().height : undefined;
    const header = document.getElementById(id);
    const finalExtraHeight = extraHeight || currentExtraHeight || commonPageExtraHeight;
     // 元素距离顶部的距离
    const tHeaderTop = header?.getBoundingClientRect()?.top || 0;
    // 窗体高度-目标元素距离窗体顶部的高度-元素底部其他的高度
    const height = `calc(100vh - ${tHeaderTop + finalExtraHeight}px)`;
    setHeight(height);
  }, [id]);
  return (
    <div
      className={`${styles.scrollableItem} ${className}`}
      id={id}
      style={{ height: treeHeight }}
    >
      {children}
    </div>
  )
}

export default ScrollableItem;