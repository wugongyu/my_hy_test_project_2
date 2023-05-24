/**
 * 审批流程弹窗
 * */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Timeline, Tooltip } from 'antd';
import { v4 } from 'uuid';
import { getUserInfos } from '@/services/global';
import styles from './ApprovalProcessModal.less';
import { getApprovalOperationHistories, getApprovalProcess } from '../service';
import { CheckCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import type{ ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import { changeEnumsListToObj } from '@/utils/handleEnumsUtil';
import { enumNames } from '@/config/globalEnumsConfig';
import type { CommonEnumsProps } from '@/services/data';
import type { ApprovalComments, ApprovalListItem, SchemeContent } from '../data';
import Paragraph from 'antd/lib/typography/Paragraph';
 
export interface ApprovalProcessModalProps {
  modalTitle?: string; // 弹窗标题
  visible: boolean;
  onVisibleChange: (flag: boolean) => void;
  textRender?: React.ReactNode | string; // 展示文案
  onSaveSuccess?: () => void; // 审批成功后的回调
  record?: Partial<ApprovalListItem>; // 当前数据
  workFlowEnums: CommonEnumsProps[];
  showCopyCode?: boolean; // 展示审批单号
}

const defaultImg = require('@/assets/normal.png');

const ApprovalProcessModal: React.FC<ApprovalProcessModalProps> = (props) => {
  const { modalTitle, visible, onVisibleChange, textRender, record, workFlowEnums, showCopyCode } = props;
  const [currentApprovalProcessContent, setApprovalProcessContent] = useState<SchemeContent[]>([]); // 当前审批流节点数据
  const [currentProcessType, setCurrentProcessType] = useState<number| undefined>(); // 当前审批流进行到的节点类型
  const [currentProcessHandlers, setCurrentProcessHandlers] = useState<CurrentUser[]>([]); // 当前审批流中包含的用户信息
  const [currentInstanceData, setInstanceData] = useState<ApprovalListItem | undefined>();
  const approvalFlowNodeTypeObj = changeEnumsListToObj({totalEnums: workFlowEnums, enumName: enumNames.FLOW_NODE_TYPE}); // 审批流节点类型对象
  const handleModalCancel = () => {
    onVisibleChange(false);
  }
  const fetchCurrentApprovalProcess = async(id: string) => {
    // 获取工作流实例审批记录
    const res = await getApprovalProcess(id);
    if(res && res?.instanceId) {
      setInstanceData(res);
      const handleContentData: SchemeContent[] = res?.schemeContent?.map((item: Partial<SchemeContent>)=> ({
        ...item,
        id: v4(),
        approvalComments: [],
      })) || [];
      setCurrentProcessType(res?.activityType);
      const opRes = await getApprovalOperationHistories(id);
      // 处理审批流各个节点的提交/审批信息
      if(opRes && opRes instanceof Array) {
        opRes?.forEach(opResItem => {
          const { approvalComments = '', approvalTime, currentNodeType, createUserId } = opResItem;
          const findIndex = handleContentData?.findIndex((t: SchemeContent) => t?.fromNodeStep === opResItem?.currentNodeStep);
          if(findIndex !== -1) {
            const replaceData = { 
              ...handleContentData[findIndex],
              approvalComments: approvalComments ? [
                ...handleContentData[findIndex].approvalComments,
                {
                  comment: approvalComments,
                  handler: createUserId, // 当前节点操作人
                  approvalTime,
                },
              ] : [
                ...handleContentData[findIndex]?.approvalComments,
              ],
              approvalTime,
            }
            if (currentNodeType === approvalFlowNodeTypeObj?.START?.value) {
              // 开始节点的操作人为创建人id
              handleContentData.splice(findIndex, 1, { 
                ...replaceData,
                nodeDesignates: createUserId ? [createUserId] : [],
              });
            } else {
              handleContentData.splice(findIndex, 1, { 
              ...replaceData,
            });
            }
            
          }
        });
      }
      // 当前审批流已流转到完成节点
      if(res?.activityType === approvalFlowNodeTypeObj.END.value) {
        const findIndex = handleContentData?.findIndex((t: SchemeContent) => t?.nodeType === res?.activityType);
        if(findIndex !== -1) {
          handleContentData.splice(findIndex, 1, { 
            ...handleContentData[findIndex],
            approvalComments: [{
              comment: '审批完成',
            }],
          });
        }
      }
      setApprovalProcessContent(handleContentData);
    }
  }
  const fetUserInfo = async(ids: string[]) => {
    // 批量查询审批人数据
    if(ids?.length > 0) {
      const res = await getUserInfos(ids?.join(','));
      if(res && res instanceof Array) {
        setCurrentProcessHandlers(res);
      };
    }
  }
  useEffect(() => {
    if(currentApprovalProcessContent && currentApprovalProcessContent?.length > 0) {
      // 当前审批流中所包含的审批人/操作人accountid信息
      const approvalPersonInfo: string[] = [];
      const nodesTemp: SchemeContent[] = [...currentApprovalProcessContent];
      nodesTemp?.forEach((item: SchemeContent) => {
        // 各节点审批人
        item?.nodeDesignates?.forEach((designates: string) => {
          if(!(approvalPersonInfo.includes(designates))) {
            approvalPersonInfo.push(designates);
          }
        });
        // 各个节点操作人
        item?.approvalComments?.forEach((c: ApprovalComments) => {
          if(c?.handler && !(approvalPersonInfo.includes(c?.handler))) {
            approvalPersonInfo.push(c?.handler);
          }
        });
      });
      fetUserInfo(approvalPersonInfo);
    } 
  }, [currentApprovalProcessContent]);
  useEffect(() => {
    if(visible) {
      if(record && record?.instanceId) {
        const { instanceId } = record;
        fetchCurrentApprovalProcess(instanceId);
      }
    }
  }, [visible, record]);
  const processHandlerRender = (c: ApprovalComments, content: SchemeContent) => {
    if(content?.nodeType === approvalFlowNodeTypeObj?.END?.value) {
      // 当前流程已结束
      if(currentProcessType === approvalFlowNodeTypeObj?.END?.value) {
        return '已结束';
      }
      return '';
    }
    if(!(c && c?.handler)) return '';
    const handledPerson = currentProcessHandlers?.find(item => item.accountId === c?.handler);
    return `${handledPerson?.nickName || '优采平台'}：${c?.comment}`;
  }

  const handlePersonRender = (content: SchemeContent) => {
    if(content?.nodeType === approvalFlowNodeTypeObj?.END?.value) {
      // 当前流程已结束
      if(currentProcessType === approvalFlowNodeTypeObj?.END?.value) {
        return (<>
          <CheckCircleOutlined style={{ fontSize: 24, color: '#87d068', marginRight: '10px' }}/>
          {content?.nodeName}
        </>)
      }
      return content?.nodeName || '';
    }
    // 审批节点有对应审批人时返回默认操作人头像
    if(content?.nodeDesignates && content?.nodeDesignates?.length > 0 ) {
      const handledPerson = currentProcessHandlers?.filter(item => item.accountId && content?.nodeDesignates?.includes(item.accountId));
      // const handlePersonNames = handledPerson?.map(item => item?.nickName)?.join(',')
      return (<div className={styles.picBox}>
        {handledPerson?.map(p => (
          <Tooltip
            title={`${p?.nickName || '优采平台'}`}
            key={`${p?.accountId || v4()}`}
          >
            <div
              className={styles.pic}
              style={{ backgroundImage: `url(${defaultImg})` }}
            />
          </Tooltip>
          ))}
          <div className={styles.handlers}>
            <span style={{ marginRight: '10px' }}>{content?.nodeName}</span>
            {/* <span>{content?.nodeType === approvalFlowNodeTypeObj?.START?.value ? '【创建人】' : '【审批人】'}</span>
            <span>{handlePersonNames}</span> */}
          </div>
      </div>);
    }
    return content?.nodeName || '';
  }
  return (
    <Modal
      width='650px'
      title={modalTitle || '审批流程'}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => handleModalCancel()}
      footer={null}
    >
      <div>
        {textRender}
      </div>
      {showCopyCode && (
        <div style={{ padding: '0 24px' }}>
          <div style={{ display: 'flex' }}>
            审批单号：<Paragraph copyable>{currentInstanceData?.approvalCode}</Paragraph>
          </div>
          <p>审批流程</p>
        </div>
      )}
      <Card bordered={false}>
          <Timeline key={v4()} mode="left">
            {currentApprovalProcessContent?.map((content: SchemeContent) => (
              <Timeline.Item key={content?.id}
                color={currentProcessType === content?.nodeType ? 'blue' : 'gray'}
                // dot={handlePersonRender(content)}
              >
                <div className={styles.approvalProcessContent}>
                  <span>{handlePersonRender(content)}</span>
                  {/* <span>{content?.nodeName}</span> */}
                  {/* <span>{content?.approvalTime}</span> */}
                </div>
                <div className={styles.approvalProcessComment}>{
                  content?.approvalComments?.map((c: ApprovalComments) => (
                    <p key={v4()} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{processHandlerRender(c, content)}</span>
                      <span>{c?.approvalTime}</span>
                    </p>
                  ))
                }</div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => handleModalCancel()}>
          确定
        </Button>
      </div>
    </Modal>
  );
};

export default connect(({ enums }: ConnectState) => ({
  workFlowEnums: enums.workFlowEnums || [], // 工作流的枚举值
}))(ApprovalProcessModal);
