/**
 * 审批弹窗
 * */ 
import React, { useState } from 'react';
import { Modal, Form, Row, Col, Radio, Input, message, Button } from 'antd';
import { rejectAudit, passAudit } from '../service';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { auditTypeEnums } from '@/config/dictionary';
import type { ApprovalListItem } from '../data';
import ChangeContentDetail from './ChangeContentDetail';
import type { ConnectState } from '@/models/connect';
import type { CommonEnumsProps } from '@/services/data';

export interface ApprovalAuditModalProps {
  handleType: 'audit' | 'detail';
  modalTitle?: string | React.ReactNode; // 弹窗标题
  visible: boolean;
  onVisibleChange: (flag: boolean) => void;
  onSaveSuccess?: (val: boolean) => void; // 审批成功后的回调
  record?: ApprovalListItem;
  dispatch: Dispatch;
  globalEnums: CommonEnumsProps[];
}
const ApprovalAuditModal: React.FC<ApprovalAuditModalProps> = (props) => {
  const { visible, onVisibleChange,
    onSaveSuccess, record, handleType } = props;
  const [confirmBtnLoading, setConfirmBtnLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleModalCancel = () => {
    form.resetFields();
    onVisibleChange(false);
  }
  // 提交
  const handleOk = async() => {
    if(!(record && record?.instanceId)) {
      message.error('审批id异常！');
      return;
    }
    const { instanceId } = record;
    await form.validateFields();
    setConfirmBtnLoading(true);
    const formVal = form.getFieldsValue();
    const { auditType, remark } = formVal;
    let res: any = null;
    if(Number(auditType) === auditTypeEnums.PASS.id) {
      res = await passAudit({
        instanceId,
        approvalComments: remark,
      });
    } else {
      res = await rejectAudit({
        instanceId,
        refusalComments: remark,
      });
    }
    if(res && res?.success) {
      // 审批成功后延时500ms关闭弹窗并刷新列表
      setConfirmBtnLoading(true);
      setTimeout(() => {
        handleModalCancel();
        if(onSaveSuccess) {
          onSaveSuccess(true);
        }
        setConfirmBtnLoading(false);
      }, 500);
      message.success('操作成功！');
    } else {
      message.error(res?.message || '审批失败！');
    }
    setConfirmBtnLoading(false);
  }
  const handleModalTitle = () => {
    const { instanceName } = record || {};
    const handleTypeText = handleType === 'audit' ? '审批' : '详情';
    return `${instanceName}${handleTypeText}`;

  }
  const footerRender = handleType === 'audit' ? (
    <>
      <Button onClick={() => handleModalCancel()}>取消</Button>
      <Button loading={confirmBtnLoading} type='primary' onClick={() => handleOk()}>确定</Button>
    </>
  ) : null;
  return (
    <Modal
      title={handleModalTitle() || '审批'}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => handleModalCancel()}
      onOk={handleOk}
      confirmLoading={confirmBtnLoading}
      // 档案/质保变更审批弹窗宽度自适应
      width={650}
      footer={footerRender}
    >
      {record?.formContext && (
        <ChangeContentDetail 
          formContext={record?.formContext}
        />
      )}
      {handleType === 'audit' && (
        <>
          <Form
            labelAlign="right"
            labelCol={{ span: 4}}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            form={form}
            initialValues={{
            }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  label="审批意见" 
                  name="auditType"
                  rules={[{ required: true, message: '请选择审批意见' }]}
                >
                  <Radio.Group>
                    {Object.keys(auditTypeEnums)?.map(k => (
                      <Radio key={auditTypeEnums[k]?.id} value={auditTypeEnums[k]?.id}>
                        {auditTypeEnums[k]?.text}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="审批备注" 
                  name="remark"
                >
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default connect(({ enums }: ConnectState) => ({
  globalEnums: enums.globalEnums || [],
}))(ApprovalAuditModal);