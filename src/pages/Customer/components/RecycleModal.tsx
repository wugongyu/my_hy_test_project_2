import { message, Modal } from "antd";
import { useState } from "react";
import type { CustomerContactListItem } from "../data";
import { recycleAssignContacts, recycleAssignCustomers } from "../service";

/**
 * 回收客户/联系人弹窗
 * */ 
export interface RecycleModalProps {
  handleType: 'customer' | 'contact'; // 回收类型，客户|联系人
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  onRefresh: (flag: boolean) => void; // flag --- 更新列表并重置页码的标志
  selectedRowData: CustomerContactListItem[];
}

const RecycleModal: React.FC<RecycleModalProps> = (props) => {
  const { visible, onVisibleChange, onRefresh, handleType, selectedRowData } = props;
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);
  const handleSaveOrCancel = (flag: boolean = false) => {
    onVisibleChange(false);
    if(flag) {
      onRefresh(flag);
    }
  }
  const handleOk = async() => {
    setSaveBtnLoading(true);
    let res = null;
    const params = selectedRowData?.map(item => {
      const { customerId, assigneeId, contactId } = item;
      const commonData = {
        customerId,
        assigneeId,
      }
      return handleType === 'customer' ? commonData : {
        ...commonData,
        contactId,
      };
    })
    if(handleType === 'customer') {
      res = await recycleAssignCustomers(params);
    } else {
      res = await recycleAssignContacts(params);
    }
    setSaveBtnLoading(false);
    if(res?.success) {
      message.success('回收成功！');
      handleSaveOrCancel(true);
    } else {
      message.error(res?.message || '回收失败！');
    }

  }
  // 去重，同个销售人员的分配数据不重复展示
  const filterSelectedData = () => {
    const filterData: (CustomerContactListItem)[] = [];
    (selectedRowData)?.forEach(item => {
      const findIndex = filterData?.findIndex(d => d.assigneeId === item.assigneeId);
      if(findIndex === -1) {
        filterData.push(item);
      }
    })
    return filterData;
  }
  return (
    <Modal
      title={`回收${handleType === 'customer' ? '客户' : '联系人'}`}
      visible={visible}
      destroyOnClose
      onCancel={() => handleSaveOrCancel()}
      onOk={handleOk}
      cancelButtonProps={{
        danger: true,
      }}
      confirmLoading={saveBtnLoading}
    >
      {handleType === 'customer' && (
        <p style={{ color: 'red' }}>回收客户会同时回收联系人。如果仅需回收联系人，请使用回收联系人功能。</p>
      )}
      <p>
         确定要回收已分配给{
           filterSelectedData()?.map(item => (
             <span key={item.uid}>
               【{item.assigneeName}】
             </span>
           ))
         }的{handleType === 'customer' ? '客户资源' : '联系人'}吗？
      </p>
    </Modal>
  );
};

export default RecycleModal;