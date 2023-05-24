/**
 * 新建/编辑客户联系人弹窗
 * */ 
import type { ConnectState } from "@/models/connect";
import type { TreeDataProps } from "@/models/customer";
import { Form, message, Modal } from "antd";
import { connect } from "umi";
import { useEffect, useState } from "react";
import type { CustomerContactListItem, CustomerDepartmentItem, CustomerListItem } from "../data";
import { createCustomerContact, updataCustomerContact } from "../service";
import CustomerContactInfo from "./CustomerContactInfo";
import { handleStrTrim } from "@/utils/utils";
import { mobilePhonePromiseKey } from "@/config/app";
import ApprovalProcessModal from "@/pages/Approval/components/ApprovalProcessModal";
import type { ApprovalListItem } from "@/pages/Approval/data";

export interface ContactOperateModalProps {
  customerId: string;
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  onRefresh?: (flag: boolean) => void;
  contactRecord?: Partial<CustomerContactListItem>;
  onContactRecordChange?: (data: Partial<CustomerContactListItem>) => void;
  departmentsData?: TreeDataProps;
  allCustomerDepartments: CustomerDepartmentItem[];
  customerInfo?: CustomerListItem;
}

interface ProcessModalDataProps {
  visible: boolean,
  data?: Partial<ApprovalListItem>,
}

const initProcessModalData = {
  visible: false,
  data: undefined,
}
const specialCheckMobilePhone = 'mobilePhone';
const checkModifyKeys = ['contactName', 'sex', specialCheckMobilePhone, 'email', 'position', 'duty', 'address', 'departmentIds']

const ContactOperateModal: React.FC<ContactOperateModalProps> = (props) => {
  const { visible, onVisibleChange, onRefresh, contactRecord,
    departmentsData, customerId, onContactRecordChange,
    allCustomerDepartments, customerInfo } = props;
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [processModalData, setProcessModalData] = useState<ProcessModalDataProps>(initProcessModalData);
  const [currentPhoneRecord, setCurrentPhoneRecord] = useState<string | undefined>();

  const [form] = Form.useForm();
  // 更新表单数据
  const updateFormData = () => {
    const targetDepartments = departmentsData ? [departmentsData.key] : contactRecord?.departmentIds;
    form.setFieldsValue({
      ...contactRecord,
      departmentIds: targetDepartments || [],
      assignees: contactRecord?.assignees?.map(item => {
        return {
          value: item.assigneeId,
          label: item.assigneeName,
        }
      }) || [],
    });
  }
  useEffect(() => {
    if(visible) {
      updateFormData();
    }
  }, [visible, departmentsData, contactRecord]);
  const handleCloseModal = (flag: boolean = false) => {
    onVisibleChange(false);
    if(flag && onRefresh) {
      onRefresh(flag);
    }
  }
  // 修改时: 校验是否有修改数据
  const checkIsModifyData = (params: { keys: string[], oldData: Partial<CustomerContactListItem>, newData: Partial<CustomerContactListItem> }) => {
    let flag = false; // 有修改的标志
    const { keys, oldData, newData } = params;
    const handledNewData = {
      ...newData,
      departmentIds: newData?.departments?.map(item => item.departmentId)?.join(',') || '',
    };
    const handledOldData = {
      ...oldData,
      departmentIds: oldData?.departmentIds?.join(',') || '',
    };
    keys.forEach(k => {
      if(k === specialCheckMobilePhone) {
        if(handledNewData[k] !== mobilePhonePromiseKey && handledNewData[k] !== currentPhoneRecord) {
          flag = true;
        }
      } else if(handledNewData[k] !== handledOldData[k]) {
        flag = true;
      }
    });
    return flag;
  }
  const handleSave = async() => {
    await form.validateFields();
    const handleTypeText = contactRecord ? '编辑' : '新增';
    setSaveBtnLoading(true);
    let res: { success: boolean; result: string; message: string; } | null = null;
    const { assignees, departmentIds, mobilePhone, ...rest} = await form.getFieldsValue();
    const params = {
      ...handleStrTrim(['contactName', 'position', 'duty', 'address'], rest),
      departments: departmentIds?.map((key: string) => {
        const findObj = allCustomerDepartments?.find(item => item.customerId === key);
        return {
          departmentId: findObj?.customerId,
          departmentName: findObj?.departmentName,
        }
      }),
      assignees: assignees?.map((item: { value: any; label: any; }) => ({
        assigneeId: item.value,
        assigneeName: item.label,
      })),
      customerName: customerInfo?.customerName || '',
      mobilePhone,
    }
    if(!mobilePhone) {
      // 用户未解密手机号码，进行约定传参
      params.mobilePhone = mobilePhonePromiseKey;
    }
    const flag = checkIsModifyData({keys: checkModifyKeys, oldData: contactRecord as Partial<CustomerContactListItem>, newData: params})
    if(contactRecord?.contactId && !flag) {
      message.error('未作任何修改，无需提交！');
      setSaveBtnLoading(false);
      return;
    }
    if(contactRecord && contactRecord?.contactId) {
      res = await updataCustomerContact(customerId, contactRecord.contactId, params)
    } else {
      res = await createCustomerContact(customerId, params);
    }
    setSaveBtnLoading(false);
    if(res?.success) {
      // message.success(`${handleTypeText}成功！`);
      const typeText = contactRecord ? '提交联系人档案变更申请成功' : '您的新建联系人申请已提交';
      Modal.info({
        content: `${typeText}。可在【审批 -> 我发起的】页面查看`,
      })
      handleCloseModal(true);
    } else if(res?.result) {
      Modal.confirm({
        title: '提示',
        content: '此联系人档案正在审批中，审批通过后会自动添加到客户通讯录。',
        okText: '查看审批进度',
        onOk: () => {
          setProcessModalData({
            ...initProcessModalData,
            visible: true,
            data: {
              instanceId: res?.result,
            }
          });
        }
      })
    } else {
      message.error(res?.message || `${handleTypeText}失败！`);
    }
  }
  return (
    <Modal
      title={`${contactRecord ? '编辑' : '新建'}联系人`}
      destroyOnClose
      maskClosable={false}
      onCancel={() => handleCloseModal()}
      visible={visible}
      onOk={handleSave}
      confirmLoading={saveBtnLoading}
    >
      {contactRecord && (
        <p style={{ color: 'red', textAlign: 'center' }}>变更联系人信息需审批，通过审批才会更新联系人信息。</p>
      )}
      <Form
        labelCol={{ span: 6}}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        form={form}
        initialValues={{
        }}
      >
        <CustomerContactInfo 
          customerId={customerId}
          formProps={form}
          contactRecord={contactRecord}
          onContactRecordChange={onContactRecordChange}
          currentPhoneRecord={currentPhoneRecord}
          setCurrentPhoneRecord={setCurrentPhoneRecord}
        />
      </Form>
      {/* 审批流程 */}
      {processModalData.visible && (
         <ApprovalProcessModal
          visible={processModalData.visible}
          onVisibleChange={(val: any) => setProcessModalData({...initProcessModalData, visible: val})}
          record={processModalData.data}
          showCopyCode
        />
       )}
    </Modal>
  );
};

export default connect(({ customer }: ConnectState) => ({
  allCustomerDepartments: customer.allCustomerDepartments || [],
  customerInfo: customer.currentCustomerInfo,
}))(ContactOperateModal);
