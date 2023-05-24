/**
 * 提交/撤销审批弹窗
 * */ 

 import React, { useState } from 'react';
 import { Modal, Form, Row, Col, Input, message } from 'antd';
 import { revokeApproval, submitApproval } from '../service';
 
 export interface ApprovalRevokeModalProps {
   modalTitle?: string; // 弹窗标题
   visible: boolean;
   onVisibleChange: (flag: boolean) => void;
   textRender?: React.ReactNode | string; // 展示文案
   onSaveSuccess?: () => void; // 审批成功后的回调
   record?: any;
   currentSubmitOrRevoke: string; // 提交或审批标志
 }
 const ApprovalSubmitRevokeModal: React.FC<ApprovalRevokeModalProps> = (props) => {
   const { modalTitle, visible, onVisibleChange, textRender, onSaveSuccess, record, currentSubmitOrRevoke } = props;
   const [confirmBtnLoading, setConfirmBtnLoading] = useState<boolean>(false);
   const handleText = currentSubmitOrRevoke === 'revoke' ? '撤销' : '提交';
   const [form] = Form.useForm();
   const handleModalCancel = () => {
     form.resetFields();
     onVisibleChange(false);
   }
   // 提交
   const hanleOk = async() => {
     if(!(record && record?.instanceId)) {
       message.error('审批异常！');
       return;
     }
     const { instanceId } = record;
     await form.validateFields();
     setConfirmBtnLoading(true);
     const formVal = form.getFieldsValue();
     let res = null;
     if(currentSubmitOrRevoke === 'revoke') {
      //  撤销审批
       res = await revokeApproval({
        instanceId,
        ...formVal});
     } else {
      //  提交审批（启用审批）
      res = await submitApproval({
        instanceId,
        ...formVal});
     }
     if(res && res?.success) {
       message.success(`${handleText}成功！`);
       onVisibleChange(false);
       if(onSaveSuccess) {
         onSaveSuccess();
       }
     } else {
       message.error(res?.message || `${handleText}失败！`);
     }
     setConfirmBtnLoading(false);
   }
   return (
     <Modal
       title={modalTitle || `${handleText}审批`}
       visible={visible}
       destroyOnClose
       maskClosable={false}
       onCancel={() => handleModalCancel()}
       onOk={hanleOk}
       confirmLoading={confirmBtnLoading}
     >
       <div>
         {textRender}
       </div>
       <Form
         labelCol={{ span: 6}}
         wrapperCol={{ span: 16 }}
         layout="horizontal"
         form={form}
         initialValues={{
         }}
       >
         <Row>
           <Col span={24}>
             <Form.Item
               label={`${handleText}原因`}
               name="description"
             >
               <Input.TextArea
                  placeholder={`请输入${handleText}原因`}
                  autoSize={{ minRows: 2, maxRows: 4 }} />
             </Form.Item>
           </Col>
         </Row>
       </Form>
     </Modal>
   );
 };
 
 export default ApprovalSubmitRevokeModal;