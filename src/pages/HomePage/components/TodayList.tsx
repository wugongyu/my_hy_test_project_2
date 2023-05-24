/**
 * 首页---我的待办事项
 *
 * */

 import React, { useState } from 'react';
 import { Card, Spin } from 'antd';
 import type { Dispatch} from 'umi';
import { history, connect } from 'umi';
 import styles from '../index.less';
import { getJKENV } from '@/utils/utils';
import type { CountsProps } from '../index';
 
 export interface ToDoListProps {
   dispatch: Dispatch;
   counts: CountsProps;
 }
 
 export type ListInfoProps = Record<string, any>;
 
 export interface ToDoListItemProps {
   title: string;
   key: string;
   listInfo: ListInfoProps[];
 }
 
 const TodayList: React.FC<ToDoListProps> = props => {
   const { dispatch, counts } = props;
   const [pageSpinning] = useState<boolean>(false);
   const toDayListList = {
    UN_DELIVERY_ORDERS: {
      title: '待发货',
      key: 'undeliveryOrders',
      listInfo: [
        {
          describe: '网订店送订单待发货', // 相关数值的描述
          numHref: '', // 跳转的菜单目录
          numToBlankHref: getJKENV('ERP_SYSTEM_URL'), // 跳转的目标系统url
          key: 'undeliveryOrders',
          extra: '', // 其他数值
          dataId: 'undeliveryOrders', // 主要数据的key值
          extraDataId: '', // 其他数据的key值
          dataUnit: '笔', // 数值单位
        },
      ],
    },
    RETURN_BACK_ORDERS: {
      title: '退货',
      key: 'returnBackOrders',
      listInfo: [
       {
         describe: '网订店送订单待退货',
         numHref: '',
         numToBlankHref: getJKENV('ERP_SYSTEM_URL'),
         key: 'returnBackOrders',
         extra: '',
         dataId: 'returnBackOrders',
         extraDataId: '', 
         dataUnit: '笔',
       },
      ],
    },
    YESTERDAY_ORDERS: {
      title: '昨日订单',
      key: 'yesterdayOrders',
      listInfo: [
       {
         describe: '门店前台客户订单',
         numHref: '',
         numToBlankHref: getJKENV('ERP_SYSTEM_URL'),
         key: 'yesterdayOrders',
         extra: '',
         dataId: 'yesterdayOrders',
         extraDataId: '', 
         dataUnit: '笔',
       },
      ],
    },
    TODAY_ORDERS: {
      title: '今日订单',
      key: 'todayOrders',
      listInfo: [
       {
         describe: '门店前台客户订单',
         numHref: '',
         numToBlankHref: getJKENV('ERP_SYSTEM_URL'),
         key: 'todayOrders',
         extra: '',
         dataId: 'todayOrders',
         extraDataId: '', 
         dataUnit: '笔',
       },
      ],
    },
  };
  const clickNumToMenu = (infoItem: ListInfoProps) => {
    const { numHref, dispatchStatusType, targetStatus, refreshListDispatchType, numToBlankHref } = infoItem;
    if (refreshListDispatchType) {
      dispatch({
        type: refreshListDispatchType,
        payload: true,
      });
    }
    if (numHref) {
      history.push(numHref);
    }
    if (dispatchStatusType && targetStatus) {
    dispatch({
      type: dispatchStatusType,
      payload: targetStatus,
    });
    }
    if (numToBlankHref) {
      window.open(numToBlankHref);
    }
  };
 
   const CardTitleRender = (
     <>
       <span>今日事件</span>
     </>
   );
   const handleDataNum = (infoItem: ListInfoProps) => {
     const showNum = counts[infoItem.dataId] || 0;
     if(showNum >= 100) return '100+';
     return showNum;
   };
   // 各个待办事项的数字提示及描述
   const handleCardDescription = (info: ListInfoProps[]) => {
     return (
       <div className={styles.todayListCardDescription}>
         {info?.map((i: any) => (
           <div className={styles.todayListCardDescriptionItem} key={i?.key}>
             <a className={styles.listInfoNum} onClick={() => clickNumToMenu(i)}>
               {handleDataNum(i)}
               {i?.dataUnit}
             </a>
             <p className={styles.listInfoDescribe}>{`${i?.describe}`}</p>
           </div>
         ))}
       </div>
     );
   };
   return (
     <Card title={CardTitleRender} className={styles.todayListCard}>
       <Spin spinning={pageSpinning}>
         {Object.keys(toDayListList)?.map((k: string) => (
           <Card.Grid
             hoverable
             className={styles.todayListCardGrid}
             key={toDayListList[k]?.key}
           >
             <Card bodyStyle={{ padding: 0 }} bordered={false}>
               <Card.Meta
                 title={toDayListList[k]?.title}
                 description={handleCardDescription(toDayListList[k]?.listInfo)}
               />
             </Card>
           </Card.Grid>
         ))}
       </Spin>
     </Card>
   );
 };
 
 export default connect()(TodayList);
 