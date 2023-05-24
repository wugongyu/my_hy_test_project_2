/**
 * 解密手机号
 * */ 

import { Spin, Typography } from "antd";
import { useState } from "react";
import type { CustomerContactListItem } from "../data";
import { decryptPhoneNumber, decryptSensitives } from "../service";

const { Link  } = Typography;
const DecryptPhoneNumber: React.FC<{
  record: CustomerContactListItem,
  decryptString?: string,
  type?: 'sensitive' | 'normal', // 解密类型，normal--常规（通过客户id与联系人id进行解密），sensitive---敏感（传参客户id与加密字符串）
}> = (props) => {
  const { record, type = 'normal', decryptString } = props;
  const encryptText = '***********';
  const [currentText, setText] = useState<string>(encryptText);
  const [loading, setLoading] = useState<boolean>(false);
  const decryptText = async() => {
    const { contactId, customerId } = record;
    if(type === 'normal' && !(contactId && customerId)) return;
    if(type === 'sensitive' && !(customerId && decryptString)) return;
    if(currentText !== encryptText) return;
    setLoading(true)
    let res = null;
    if(type === 'normal' && customerId) {
      res = await decryptPhoneNumber(customerId, contactId);
    }
    if(type === 'sensitive' && customerId && decryptString) {
      res = await decryptSensitives(customerId, decryptString);
    }
    if(typeof res === 'string') {
      setText(res);
    }
    setLoading(false);
    // 三秒后重新加密
    setTimeout(() => {
      setText(encryptText);
    }, 3000);
  };
  return <div style={{display: 'inline-block'}}>
    <Spin spinning={loading}>
      <Link onClick={() => decryptText()}>
        {currentText}
      </Link>
    </Spin>
  </div>
};

export default DecryptPhoneNumber;