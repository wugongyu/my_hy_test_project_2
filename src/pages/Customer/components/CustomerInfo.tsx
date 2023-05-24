/**
 * 客户表单信息
 * */
import type { FormListProps} from "@/components/CommonFormItemHandler";
import { longItemColLayoutObj, formListRender } from "@/components/CommonFormItemHandler";
import { Button, DatePicker, Form, Input, message, Spin } from "antd";
// import GeographicView from '@/components/GeographicView';
import { handleDateInfo, handleDetailCodeNameToRegion, handleRegionToDetailCodeName, handleStrTrim, validatePhone } from "@/utils/utils";
import { useEffect, useState } from "react";
import type { CustomerListItem } from "../data";
import { createCustomer, updateCustomer } from "../service";
import moment from "moment";
import type { RegionOptionsProps } from "@/components/RegionCascader";
import RegionCascader, { handleInitOptionsData } from "@/components/RegionCascader";
import { allSpaceCheck } from "@/config/app";

export interface CustomerInfoProps {
  handleType: 'add' | 'edit';
  onSaveOrCancel?: (flag: boolean) => void; // 确认或取消时的回调函数 flag为true即保存成功后的刷新标志
  customerFileRecord?: CustomerListItem;
}

const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
  const { handleType, onSaveOrCancel, customerFileRecord } = props;
  const [form] = Form.useForm();
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);
  const [formSpining, setFormSpinning] = useState<boolean>(false);
  const [options, setOptions] = useState<RegionOptionsProps[]>([]);
  // 初始化区域选项
  const handleInit = async(value: RegionOptionsProps[]) => {
    setFormSpinning(true);
    const initOptions = await handleInitOptionsData(value);
    setOptions(initOptions); 
    setFormSpinning(false);
  } 
  useEffect(() => {
    if(customerFileRecord) {
      const { establishedTime, ...rest} = customerFileRecord; 
      const regionData = handleDetailCodeNameToRegion({detailNameCodeObj: rest});
      form.setFieldsValue({
        ...rest,
        regions: regionData,
        establishedTime: establishedTime ? moment(establishedTime) : '',
      });
      handleInit(regionData);
    }
  }, [customerFileRecord]);
  const handleSuccess = (flag: boolean = false) => {
    if(onSaveOrCancel) {
      onSaveOrCancel(flag);
    }
  }
  const handleSave = async() => {
    await form.validateFields();
    if(handleType === 'edit' && !(customerFileRecord && customerFileRecord?.customerId)) {
      message.error('客户id不存在！');
      return;
    }
    const handleTypeText = handleType === 'add' ? '添加' : '编辑' 
    setSaveBtnLoading(true);
    const { establishedTime, regions, ...rest } = form.getFieldsValue();
    const params = {
      ...handleStrTrim(['customerShortName', 'customerName'], rest),
      ...handleRegionToDetailCodeName({regionData: regions}),
      establishedTime: handleDateInfo({ date: establishedTime }),
    }
    let res = null;
    if(handleType === 'add') {
      res = await createCustomer(params);
    } else {
      res = await updateCustomer(customerFileRecord?.customerId, params)
    }
    setSaveBtnLoading(false);
    if(res?.success) {
      handleSuccess(true);
      message.success(`${handleTypeText}成功！`);
    } else {
      message.error(res?.message || `${handleTypeText}失败！`);
    }
  }
  const customerFormItem: FormListProps = {
    0: [
      {
        title: '客户简称',
        dataIndex: 'customerShortName',
        rules: [{ required: true, message: '请输入' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={10} placeholder="输入客户简称，最多10字" />),
      },
      {
        title: '客户全称',
        dataIndex: 'customerName',
        rules: [{ required: true, message: '请输入' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={50} placeholder="输入客户全称，最多50字" />),
      },
      {
        title: '成立日期',
        dataIndex: 'establishedTime',
        colLayoutObj: longItemColLayoutObj,
        component: (
          <DatePicker style={{ width: '100%' }} />
        ),
      },
      {
        title: '注册地址',
        dataIndex: 'regions',
        colLayoutObj: longItemColLayoutObj,
        component: (<RegionCascader
            initOptions={options}
          />),
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        rules: [{...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={50} placeholder="输入详细地址，最多50字" />),
      },
      {
        title: '办公电话',
        dataIndex: 'contact',
        colLayoutObj: longItemColLayoutObj,
        rules: [{ validator: validatePhone }],
        component: (<Input maxLength={20} placeholder="固话/手机号码" />),
      },     
    ],
  }
  return (
    <Spin spinning={formSpining}>
      <Form
        labelCol={{ span: 6}}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        form={form}
        initialValues={{
        }}
      >
        {formListRender(customerFormItem).map((listItem: any) => listItem)}
        <Form.Item wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {(handleType === 'add') && (<Button danger onClick={() => handleSuccess(false)}>取消</Button>)}
          <Button loading={saveBtnLoading} type="primary" style={{ margin: '0 32px' }} onClick={() => handleSave()}>{handleType === 'add' ? '确定' : '保存'}</Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CustomerInfo;