import type { StatusProps } from "@/config/dictionary";
import { genderTypeForTable } from "@/config/dictionary";
import { enumNames } from "@/config/globalEnumsConfig";
import type { ConnectState } from "@/models/connect";
import DecryptPhoneNumber from "@/pages/Customer/components/DecryptPhoneNumber";
import type { CustomerContactListItem } from "@/pages/Customer/data";
import type { CommonEnumsProps } from "@/services/data";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";
import { useEffect, useState } from "react";
import { connect } from "umi";

/**
 * 需审批的变更内容详情
 * */ 
interface ChangeContentDetailProps {
  formContext: string;
  globalEnums: CommonEnumsProps[];
}

interface ContactFormItemProps {
  key: string;
  label: string;
  valueEnum?: StatusProps;
}
interface FormContextProps {
  type: string;
  currentContext?: Record<string, any>; // 变更后数据
  beforeContext?:  Record<string, any>; // 变更前数据
}
const tableMobilePhoneKey = 'mobilePhone';
const ChangeContentDetail:  React.FC<ChangeContentDetailProps> = (props) => {
  const { formContext, globalEnums } = props;
  const [currentFormContext, setCurrentFormContext] = useState<FormContextProps | undefined>();
  const contextType = changeEnumsListToObj({totalEnums: globalEnums, enumName: enumNames.CONTEXT_TYPE});
  useEffect(() => {
    if(formContext) {
      const contentObj = JSON.parse(formContext);
      setCurrentFormContext(contentObj);
    }
  }, [formContext]);
  const contactFormItemKeys: ContactFormItemProps[] = [
    {
      key: 'contactName',
      label: '姓名',
    },
    {
      key: 'sex',
      label: '性别',
      valueEnum: genderTypeForTable,
    },
    {
      key: tableMobilePhoneKey,
      label: '手机',
    },
    {
      key: 'email',
      label: '邮箱',
    },
    {
      key: 'position',
      label: '职位',
    },
    {
      key: 'duty',
      label: '职责',
    },
    {
      key: 'address',
      label: '城市',
    },
    {
      key: 'departmentName',
      label: '部门',
    },
    {
      key: 'customerName',
      label: '客户',
    },
  ];
  const handleValue = (item: ContactFormItemProps, type: 'before' | 'current') => {
    const targetContext = (currentFormContext || {})[`${type}Context`];
    const targetValue = (targetContext && targetContext[item.key]) || ''; 
    let targetValueText = '';
    
    if(item.valueEnum) {
      targetValueText = (item.valueEnum[targetValue] && item.valueEnum[targetValue]?.text) || ''
    } else if(item.key === 'departmentName') {
      targetValueText = targetContext?.departments?.map((dItem: { departmentName: string; }) => dItem.departmentName)?.join(',');
    } else {
      targetValueText = targetValue;
    }
    return targetValueText;
  }
  // 电话号码的特殊处理
  const handlePhoneValue = () => {
    const { beforeContext = {}, currentContext = {}, type } = currentFormContext || {};
    if(type === contextType?.ModifyCustomerContact?.id) {
      return (
        <>
          {beforeContext[tableMobilePhoneKey] !== currentContext[tableMobilePhoneKey] && (
            <> 
              <DecryptPhoneNumber 
                record={currentContext as CustomerContactListItem}
                decryptString={beforeContext[tableMobilePhoneKey]}
                type='sensitive'
              />
              <span style={{ margin: '0 10px' }}>变更为</span>
            </>
          )}
          <DecryptPhoneNumber 
            record={currentContext as CustomerContactListItem}
            decryptString={currentContext[tableMobilePhoneKey]}
            type='sensitive'
          />
        </>
      )
    }
    return currentContext[tableMobilePhoneKey] ? <DecryptPhoneNumber 
      record={currentContext as CustomerContactListItem}
      decryptString={currentContext[tableMobilePhoneKey]}
      type='sensitive'
    /> : '';
  }
  const handleTypeText = () => {
    const { type } = currentFormContext || {};
    if(type === contextType?.CreateCustomerContact?.id) {
      return '联系人信息';
    }
    if(type === contextType?.ModifyCustomerContact?.id) {
      return '本次审批涉及变更的信息';
    }
    return '';
  }
  return (
    <>
      <div style={{ padding: '0 24px' }}>
        {handleTypeText() && (
          <p>{handleTypeText()}</p>
        )}
        {contactFormItemKeys?.map(item => (
          <div key={item.key} style={{ marginBottom: '12px' }}>
            <span>{item.label}：</span>
            {item.key === tableMobilePhoneKey && (
              <>
                {handlePhoneValue()}
              </>
            )}
            {item.key !== tableMobilePhoneKey && !currentFormContext?.beforeContext && (
              <>
                <span>{handleValue(item, 'current')}</span>
              </>
            )}
            {item.key !== tableMobilePhoneKey && currentFormContext?.beforeContext && (
              <>
                {handleValue(item, 'current') === handleValue(item, 'before') ? null : (
                  <>
                    <span>{handleValue(item, 'before')}</span>
                    <span style={{ margin: '0 10px' }}>变更为</span>
                  </>
                )}
                <span>{handleValue(item, 'current')}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default connect(({ enums }: ConnectState) => ({
  globalEnums: enums.globalEnums || [],
}))(ChangeContentDetail);