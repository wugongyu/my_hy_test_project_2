/**
 * 落单密码修改弹窗
 * */
import { numCheck } from '@/config/app';
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CompanyOptionProps } from '@/models/global';
import { changeOrderPassword } from '../service';
import { encryptPassWordByMD5 } from '@/utils/utils';

export interface SalePasswordSettingModalProps {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  globalSelectedCompany?: CompanyOptionProps;
}

const SalePasswordSettingModal: React.FC<SalePasswordSettingModalProps> = (props) => {
  const { visible, onVisibleChange, globalSelectedCompany } = props;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    onVisibleChange(false);
  };
  const checkForm = () => {
    const formValues = form?.getFieldsValue();
    const { oldPassword, newPassword, reNewPassword } = formValues;
    if (oldPassword === newPassword) {
      message.error('新密码与旧密码不能一样');
      return false;
    }
    if (newPassword !== reNewPassword) {
      message.error('两次输入的新落单密码需一致');
      return false;
    }
    return true;
  };
  const handleOk = async () => {
    await form?.validateFields();
    setConfirmLoading(true);
    if (checkForm()) {
      const formValues = form?.getFieldsValue();
      const { oldPassword, newPassword } = formValues;
      // 密码使用md5加密(字符串+转小写)
      const oPwd = encryptPassWordByMD5({ val: oldPassword });
      const nPwd = encryptPassWordByMD5({ val: newPassword });
      const params = {
        warehouseId: globalSelectedCompany?.warehouseId,
        password: nPwd,
        oldPassword: oPwd,
      };
      const res = await changeOrderPassword(params);
      if (res?.success) {
        message.success('修改成功');
        handleCloseModal();
      } else {
        message.error(res?.message || '修改失败！');
      }
    }
    setConfirmLoading(false);
  };
  return (
    <Modal
      title="修改落单密码"
      width={400}
      visible={visible}
      onCancel={handleCloseModal}
      destroyOnClose
      maskClosable={false}
      onOk={handleOk}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          label="旧落单密码"
          name="oldPassword"
          rules={[{ required: true, message: '密码不能为空' }, { ...numCheck }]}
        >
          <Input.Password maxLength={6} placeholder="输入原落单密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="新落单密码"
          name="newPassword"
          rules={[{ required: true, message: '密码不能为空' }, { ...numCheck }]}
        >
          <Input.Password maxLength={6} placeholder="输入新落单密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="确认新落单密码"
          name="reNewPassword"
          rules={[{ required: true, message: '密码不能为空' }, { ...numCheck }]}
        >
          <Input.Password
            maxLength={6}
            placeholder="再次输入新落单密码"
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ global }: ConnectState) => ({
  globalSelectedCompany: global.globalSelectedCompany,
}))(SalePasswordSettingModal);
