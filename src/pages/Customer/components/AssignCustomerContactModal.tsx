/**
 * 分配客户/联系人弹窗
 * */
import RoleBelonger from "@/components/RoleBelonger";
import { message, Modal } from "antd";
import { useState } from "react";
import type { AssignContactsParams, AssignCustomerParams, CustomerContactListItem, CustomerListItem } from "../data";
import { assignCustomerContacts, assignCustomers } from "../service";

export interface AssignCustomerContactModalProps {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  onRefresh: (flag: boolean) => void;
  selectedRowData: CustomerListItem[] | CustomerContactListItem[];
  handleType: 'customer' | 'contact';
  customerId?: string;
}

const AssignCustomerContactModal: React.FC<AssignCustomerContactModalProps> = (props) => {
  const { visible, onRefresh, onVisibleChange, selectedRowData, handleType, customerId } = props;
  const [assignContacts, setAssignContacts] = useState<any[]>([]);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const handleSaveOrCancel = (flag: boolean = false) => {
    setAssignContacts([]);
    onVisibleChange(false);
    if(flag) {
      onRefresh(flag);
    }
  }
  const handleSave = async() => {
    if(handleType === 'contact' && !customerId) {
      message.error('客户id异常！');
      return;
    }
    if(assignContacts.length === 0) {
      message.error('请先选择分配人员之后再进行提交！');
      return;
    }
    setSaveBtnLoading(true);
    let res = null;
    const commonParams = {
      assignees: assignContacts?.map(item => ({
        assigneeId: item.value,
        assigneeName: item.label,
      }))
    }
    if(handleType === 'customer') {
      const params: AssignCustomerParams = {
        customerIds: (selectedRowData as CustomerListItem[])?.map(item => item.customerId),
        ...commonParams,
      }
      res = await assignCustomers(params);
    } else {
      const params: AssignContactsParams = {
        contactIds: (selectedRowData as CustomerContactListItem[])?.map(item => item.contactId),
        ...commonParams,
      };
      res = await assignCustomerContacts(customerId as string, params);
    }
    setSaveBtnLoading(false);
    if(res?.success) {
      message.success('分配成功');
      handleSaveOrCancel(true);
    } else {
      message.error(res?.message || '分配失败！');
    }
  }
  return (
    <Modal
      title={handleType === 'customer' ? "分配客户" : '变更联系人归属'}
      visible={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => handleSaveOrCancel()}
      onOk={handleSave}
      cancelButtonProps={{
        danger: true,
      }}
      confirmLoading={saveBtnLoading}
    >
      <p>{handleType === 'customer' ? '拟分配客户：' : '联系人'}</p>
      <div style={{ height: 300, overflow: 'auto' }}>
        {selectedRowData?.map((item, index) => (
          <div key={item[`${handleType}Id`]}>
            <p>
              {index + 1}、{item[`${handleType}Name`]}
            </p>
          </div>
        ))}
      </div>
      <div>
        <p>分配给：</p>
        <RoleBelonger
          style={{ width: '100%' }}
          labelInValue
          multiple={true}
          value={assignContacts}
          onChange={setAssignContacts}
          placeholder="输入销售人员姓名查找"
        />
      </div>
      
    </Modal>
  );
};

export default AssignCustomerContactModal;