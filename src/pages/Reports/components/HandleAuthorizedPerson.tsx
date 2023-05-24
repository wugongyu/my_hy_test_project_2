/**
 * 停用启用授权账号用户
 * */
import { Form, Input, message, Modal } from "antd";
import { useState } from "react";
import type { AuthorizationListItem } from "../data";
import styles from '../index.less';
import { modifyDataAuthorizationStatus } from "../service";

 

interface HandleAuthorizedPersonProps {
  selectedData: AuthorizationListItem[];
  visible: boolean;
  onVisibleChange: (refreshFlag: boolean) => void;
  handleType: 'stop' | 'start';
  targetStatusValue: number;
}

const HandleAuthorizedPerson: React.FC<HandleAuthorizedPersonProps> = (props) => {
  const { visible, onVisibleChange, handleType, selectedData, targetStatusValue } = props;
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleTypeText = handleType === 'start' ? '启用' : '停用';
  const handleSave = async() => {
    await form?.validateFields();
    setSaveBtnLoading(true);
    const formVals = await form?.getFieldsValue();
    const params = {
      ...formVals,
      dataAuthorizationIds: selectedData?.map(item => item.dataAuthorizationId),
      authorizedStatus: targetStatusValue,
    }
    const res = await modifyDataAuthorizationStatus(params);
    setSaveBtnLoading(false);
    if(res?.success) {
      message.success(`${handleTypeText}成功！`);
      onVisibleChange(true);
    } else {
      message.error(res?.message || `${handleTypeText}失败！`);
    }
  }
  return (
    <Modal
      visible={visible}
      onCancel={() => onVisibleChange(false)}
      title={`${handleTypeText}授权`}
      destroyOnClose
      maskClosable={false}
      onOk={handleSave}
      confirmLoading={saveBtnLoading}
    >
      <Form
        labelCol={{ span: 6}}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        form={form}
        initialValues={{
        }}
      >

        <Form.Item label="授权对象">
          {selectedData?.map((item, index) => (
            <span key={item.dataAuthorizationId} className={styles.authorizationUserItem} style={{ marginRight: 5 }}>
              <span className={styles.authorizationUserItemIndex}>{index + 1}</span>
              <span>{item.authorizedUserName}</span>
              {index !== selectedData?.length - 1 && (
                <span>；</span>
              )}
            </span>
          ))}
        </Form.Item>
        <Form.Item label={`${handleTypeText}原因`} name="reason" >
            <Input maxLength={50} placeholder={`输入${handleTypeText}原因，最多50字`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HandleAuthorizedPerson;