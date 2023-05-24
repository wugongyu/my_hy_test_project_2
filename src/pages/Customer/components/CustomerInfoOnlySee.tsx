/**
 * 客户档案信息（只可读）
 * */
import { handleDateInfo } from "@/utils/utils";
import { Descriptions } from "antd";
import type { CustomerListItem } from "../data";

export interface CustomerInfoOnlySeeProps {
  customerFileRecord?: CustomerListItem;
}

const CustomerInfoOnlySee: React.FC<CustomerInfoOnlySeeProps> = (props) => {
  const { customerFileRecord } = props;
  const handleAddress = () => {
    if(!customerFileRecord) return '';
    const { provinceName = '', cityName = '', townshipName = '' } = customerFileRecord;

    let str = `${provinceName}${cityName}${townshipName}`
    str = str.replace('市辖区', ''); // 剥离掉市辖区
    return str;
  }
  return (
    <div style={{ paddingLeft: 24 }}>
      <Descriptions column={1}>
        <Descriptions.Item label="客户简称">{customerFileRecord?.customerShortName}</Descriptions.Item>
        <Descriptions.Item label="客户全称">{customerFileRecord?.customerName}</Descriptions.Item>
        <Descriptions.Item label="成立日期">{handleDateInfo({date: customerFileRecord?.establishedTime})}</Descriptions.Item>
        <Descriptions.Item label="注册地址">{handleAddress()}</Descriptions.Item>
        <Descriptions.Item label="详细地址">{customerFileRecord?.address}</Descriptions.Item>
        <Descriptions.Item label="办公电话">{customerFileRecord?.contact}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default CustomerInfoOnlySee;