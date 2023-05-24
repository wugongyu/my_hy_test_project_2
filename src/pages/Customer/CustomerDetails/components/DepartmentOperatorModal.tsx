/**
 * 部门相关操作弹窗（新增下级部门/修改部门名称）
 * */
import { Form, Input, message, Modal, TreeSelect } from "antd";
import type { TreeDataProps } from "@/models/customer";
import { connect } from "umi";
import type { ConnectState } from "@/models/connect";
import { useEffect, useState } from "react";
import { createCustomerDepartment, updateCustomerDepartment } from "../../service";
import { allSpaceCheck } from "@/config/app";
import { handleStrTrim } from "@/utils/utils";

export interface DepartmentOperatorModalProps {
  customerId: string;
  handleType: 'add' | 'updateName';
  visible: boolean;
  onVisibleChange: (flag: boolean) => void; // flag --- 更新部门树的标志
  data: TreeDataProps;
  departmentsTreeData: TreeDataProps[];
}

const DepartmentOperatorModal: React.FC<DepartmentOperatorModalProps> = (props) => {
  const { visible, onVisibleChange, handleType, departmentsTreeData, data, customerId } = props;
  const [form] = Form.useForm();
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);
  useEffect(() => {
    if(visible && data) {
      form.setFieldsValue({
        parentDepartmentId: data.key,
      });
    }
  }, [visible, data]);
  const handleClose = (flag: boolean = false) => {
    onVisibleChange(flag)
  }
  const handleSave = async() => {
    await form.validateFields();
    setSaveBtnLoading(true);
    const formVals = form.getFieldsValue();
    const handleTypeText = handleType === 'add' ? '添加' : '修改';
    let res = null;
    if(handleType === 'add') {
      res = await createCustomerDepartment(customerId, handleStrTrim(['departmentName'], formVals));
    } else {
      res = await updateCustomerDepartment(customerId, data.key, formVals);
    }
    setSaveBtnLoading(false);
    if(res && res?.success) {
      message.success(`${handleTypeText}成功`);
      handleClose(true);
    } else {
      message.error(res?.message || `${handleTypeText}失败！`);
    }
  }
  return (
    <Modal
      title={handleType === 'add' ? '添加部门' : '修改部门名称'}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => handleClose()}
      confirmLoading={saveBtnLoading}
      onOk={handleSave}
    >
      <Form
        labelCol={{ span: 6}}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        form={form}
        initialValues={{
        }}
      >
        {handleType === 'add' && (
          <>
            <Form.Item label="部门名称" name="departmentName"  rules={[{ required: true, message: '请输入' }, {...allSpaceCheck}]}>
              <Input maxLength={10} placeholder="部门名称，最多10个字" />
            </Form.Item>
            <Form.Item label="所属部门" name="parentDepartmentId" rules={[{ required: true, message: '请选择' }]}>
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={departmentsTreeData || []}
                fieldNames={{
                  label: 'title',
                  value: 'key',
                  children: 'children',
                }}
                placeholder="请选择部门"
                treeDefaultExpandAll
              />
            </Form.Item>
          </>
        )}
        {handleType === 'updateName' && (
          <>
            <Form.Item label="原部门名称">
              {data.title}
            </Form.Item>
            <Form.Item label="新部门名称" name="departmentName"  rules={[{ required: true, message: '请输入' }, {...allSpaceCheck}]}>
              <Input maxLength={10} placeholder="部门名称，最多10个字" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default connect(({ customer }: ConnectState) => ({
  departmentsTreeData: customer.departmentsTreeData || [],
}))(DepartmentOperatorModal);