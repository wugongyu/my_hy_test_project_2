/**
 * 新建客户弹窗
 * */
import { Modal } from "antd";
import CustomerInfo from "./CustomerInfo";

export interface CustomerOperateModalProps {
  visible: boolean;
  onVisibleChange: (flag: boolean) => void;
  onRefresh: (flag: boolean) => void;
}
const CustomerOperateModal: React.FC<CustomerOperateModalProps> = (props) => {
  const { visible, onVisibleChange, onRefresh } = props;
  const handleSaveOrCancel = (flag: boolean) => {
    onVisibleChange(false);
    if(flag) {
      // 新建客户后刷新列表并重置列表页码
      onRefresh(true);
    }
  }
  return (
    <Modal
      title="新建客户"
      destroyOnClose
      footer={null}
      maskClosable={false}
      visible={visible}
      onCancel={() => handleSaveOrCancel(false)}
    >
      <CustomerInfo 
        handleType="add"
        onSaveOrCancel={handleSaveOrCancel}
      />
    </Modal>
  );
};

export default CustomerOperateModal;
