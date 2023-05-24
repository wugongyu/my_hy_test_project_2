/**
 * 审批的操作按钮
 * */
import ListActionBtnsRender from "@/components/CommonListActionBtnsRender";
import type { CommonEnumsProps, MatchDataProps } from "@/services/data";
import { message } from "antd";
import { approvalListPathType } from "../index";
import type { ApprovalListItem } from "../data";
import { useState } from "react";
import ApprovalProcessModal from "./ApprovalProcessModal";
import ApprovalAuditModal from "./ApprovalAuditModal";
import { approvalNotify } from "../service";
import { connect } from "umi";
import type { ConnectState } from "@/models/connect";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";
import { enumNames } from "@/config/globalEnumsConfig";
import ApprovalSubmitRevokeModal from "./ApprovalRevokeModal";

export interface ApprovalActionProps {
  match: MatchDataProps;
  rowDataRecord: ApprovalListItem;
  refreshList: () => void; // 操作完成后的刷新列表回调函数
  approvalModalTitle?: React.ReactNode | string; // 审批弹窗标题
  globalEnums: CommonEnumsProps[];
}

interface AuditOrDetailModalDataProps {
  visible: boolean;
  type: 'audit' | 'detail';
}

const initAuditOrDetailModalData: AuditOrDetailModalDataProps = {
  visible: false,
  type: 'audit',
};

const ApprovalAction: React.FC<ApprovalActionProps> = (props) => {
  const { match: { path }, rowDataRecord, refreshList, globalEnums } = props;
  const [approvalProcessModalVisible, setApprovalProcessModalVisible] = useState<boolean>(false); // 流程弹窗
  const [auditOrDetailModalData, setAuditOrDetailModalData] = useState<AuditOrDetailModalDataProps>(initAuditOrDetailModalData);
  const approvalStatusDictionary = changeEnumsListToObj({totalEnums: globalEnums, enumName: enumNames.APPROVAL_STATUS});
  const [approvalRevokeModalVisible, setApprovalRevokeModalVisible] = useState<boolean>(false); // 撤销弹窗
  const [currentSubmitOrRevoke, setSubmitOrRevoke] = useState<string>('');

  // 通知请求
  const noticeRequest = async(id: string) => {
    const res = await approvalNotify(id);
    if(res && res?.success) {
      message.success('通知成功！');
      refreshList();
    } else {
      message.error(res?.message || '通知失败！');
    }
  }
  // 启用/撤销
  const handleRevoke = (key: string) => {
    if(!key) {
      message.error('操作异常');
      return;
    }
    setSubmitOrRevoke(key);
    setApprovalRevokeModalVisible(true);
  };
  const menuClick = (key: string) => {
    if(!(rowDataRecord && rowDataRecord?.instanceId)) {
      message.error('审批id不存在！');
      return;
    }
    switch(key) {
      case 'process':
        setApprovalProcessModalVisible(true);
        break; 
      case 'approve':
        setAuditOrDetailModalData({
          type: 'audit',
          visible: true,
        });
        break;
      case 'detail':
        setAuditOrDetailModalData({
          type: 'detail',
          visible: true,
        });
        break;
      case 'notice':
        noticeRequest(rowDataRecord.instanceId);
        break;
      case 'submit':
        // handleSubmitDraft(approvalInfo);
        handleRevoke(key);
        break;
      case 'revoke':
        handleRevoke(key);
        break;
      default:
        break;
    }
  }
  const actionBtns = {
    APPROVAL_BTN: {
      key: 'approve',
      text: '审批',
      isShow: (path === approvalListPathType.MY_APPROVAL.path),
    },
    DETAIL_BTN: {
      key: 'detail',
      text: '详情',
      isShow: (path !== approvalListPathType.MY_APPROVAL.path),
    },
    PROCESS_BTN: {
      key: 'process',
      text: '流程',
      isShow: true,
    },
    // 待审批/已审批有我的通知功能
    NOTICE_BTN: {
      key: 'notice',
      text: '通知',
      isShow: true,
    },
    // 审批状态为草稿(即新建)的审批流可提交
    SUBMIT_BTN: {
      key: 'submit',
      text: '提交',
      isShow: (rowDataRecord?.instanceStatus === approvalStatusDictionary?.Draft?.id),
    },
    // 审批状态为草稿(即新建)或还未审批的审批流可撤销
    REVOKE_BTN: {
      key: 'revoke',
      text: '中止',
      isShow: ([approvalStatusDictionary?.Draft?.id, approvalStatusDictionary?.Running?.id].includes(rowDataRecord?.instanceStatus))
    },
  }
  return (
    <>
      <ListActionBtnsRender 
        btns={actionBtns}
        menuClick={(k: string) => menuClick(k)}
      />
       {/* 审批流程 */}
       {approvalProcessModalVisible && (
         <ApprovalProcessModal
          visible={approvalProcessModalVisible}
          onVisibleChange={setApprovalProcessModalVisible}
          record={rowDataRecord}
        />
       )}
       {/* 审批/查看详情弹窗 */}
       {auditOrDetailModalData?.visible && (
          <ApprovalAuditModal
            handleType={auditOrDetailModalData.type}
            visible={auditOrDetailModalData.visible}
            onVisibleChange={(val) => setAuditOrDetailModalData({
              ...initAuditOrDetailModalData,
              visible: val,
            })}
            onSaveSuccess={refreshList}
            record={rowDataRecord}
          />
       )}
       {/* 提交/撤销审批 */}
       <ApprovalSubmitRevokeModal
          visible={approvalRevokeModalVisible}
          onVisibleChange={setApprovalRevokeModalVisible}
          record={rowDataRecord}
          onSaveSuccess={refreshList}
          currentSubmitOrRevoke={currentSubmitOrRevoke}
        />
    </>
  );
};

export default connect(({ enums }: ConnectState) => ({
  globalEnums: enums.globalEnums || []
}))(ApprovalAction);
