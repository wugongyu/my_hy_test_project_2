/* eslint-disable prefer-promise-reject-errors */
/**
 * 客户联系人表单信息
 * */
import type { FormListProps} from "@/components/CommonFormItemHandler";
import { formListRender, longItemColLayoutObj } from "@/components/CommonFormItemHandler";
import RoleBelonger from "@/components/RoleBelonger";
import { allSpaceCheck, emailCheck, phoneCheck } from "@/config/app";
import { genderType } from "@/config/dictionary";
import type { TreeDataProps } from "@/models/customer";
import type { ConnectState } from "@/models/connect";
import type { FormInstance} from "antd";
import { Modal} from "antd";
import { message} from "antd";
import { TreeSelect, Spin, Input, Radio} from "antd";
import { connect } from "umi";
import type { AssigneeItem, CustomerContactListItem } from "../data";
import { checkOperateContactRight, checkPhone, decryptPhoneNumber, getCustomerContactInfo } from "../service";
import { useState } from "react";
import  styles from './index.less';
import { getMunuAuth } from "@/utils/utils";
import { systemAuth } from "@/config/common";
import type { CurrentUser } from '@/models/user';
import { FormOutlined } from "@ant-design/icons";

export interface CustomerContactInfoProps {
  customerId: string;
  departmentsTreeData: TreeDataProps[];
  contactRecord?: Partial<CustomerContactListItem>;
  formProps: FormInstance;
  currentUser?: CurrentUser;
  onContactRecordChange?: (data: Partial<CustomerContactListItem>) => void;
  currentPhoneRecord?: string;
  setCurrentPhoneRecord?: (val: string) => void;
}

interface CheckExitDataProps {
  isExist: boolean;
  contactId?: string;
}

const initCheckExitData: CheckExitDataProps = {
  isExist: false,
  contactId: '',
}

const showModalInfo = (params: {content: string}) => {
  Modal.info({
    ...params,
  })
}

const CustomerContactInfo: React.FC<CustomerContactInfoProps> = (props) => {
  const { departmentsTreeData, contactRecord, customerId,
    formProps, onContactRecordChange, currentPhoneRecord, setCurrentPhoneRecord } = props;
  const [checkIsExitData, setIsExitData] = useState<CheckExitDataProps>(initCheckExitData);
  const [hasRightData, setHasRightData] = useState<AssigneeItem | undefined>();
  const [formItemSpinning, setFormItemSpinning] = useState<boolean>(false);
  const [phoneNumberEditable, setEditable] = useState<boolean>(false);
  
  // 解密客户联系人手机
  const getContactPhoneInfo = async(contactId: string) => {
    setFormItemSpinning(true);
    const res = await decryptPhoneNumber(customerId, contactId);
    if(typeof res === 'string') {
      formProps.setFieldValue('mobilePhone', res);
      if(setCurrentPhoneRecord) {
        setCurrentPhoneRecord(res);
      }
    }
    setFormItemSpinning(false);
  }
  const handleToDecrypt = () => {
    if(contactRecord?.contactId && customerId) {
      // 解密客户联系人手机
      setEditable(true);
      getContactPhoneInfo(contactRecord.contactId);
    }
  }
  // 校验电话号码是否已添加过
  const checkIsPhoneExit = (phone: string) => {
    return new Promise((resolve, reject) => {
      checkPhone(customerId, phone)
        .then(res => {
          if(res &&(res.isExist)) {
            setIsExitData(res);
            reject(contactRecord ? '此手机号已关联了联系人档案。' : '此联系人档案已存在。');
          } else {
            setIsExitData(initCheckExitData);
            resolve(false);
          };
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  const checkCurrentUserInAssignment = (resData: any) => {
    let flag = false;
    if(resData && resData?.assigneeId) {
      flag = true;
    }
    return flag;
  }
  // 校验当前用户是否有权限查看指定的联系人信息
  const checkHasOperateContactRight = (contactId: string) => {
    return new Promise((resolve, reject) => {
      checkOperateContactRight(customerId, contactId)
        .then(res => {
          if(checkCurrentUserInAssignment(res)) {
            setHasRightData(res);
            reject('此手机号已关联了联系人档案。');
          } else {
            setHasRightData(undefined);
            resolve(false);
          };
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  const checkCurrent = async(targetContactId?: string) => {
    setFormItemSpinning(true);
    let rightFlag = false;
    const currentAuth = getMunuAuth();
    const hasManageRight = currentAuth?.includes(systemAuth.systemManageAuth); // 当前账号是否拥有管理员权限
    if(hasManageRight) rightFlag = true;
    if(!hasManageRight && targetContactId) {
      // 若无管理员权限， 获取目标客户联系人的分配销售，校验当前账号是否为分配销售
      const res = await checkOperateContactRight(customerId, targetContactId); 
      rightFlag = checkCurrentUserInAssignment(res);
    }
    setFormItemSpinning(false);
    return rightFlag;
  }
  // 重置校验数据结果
  const resetCheckData = (isPhone: boolean = false, isRight: boolean = false) => {
    if(isPhone) {
      setIsExitData(initCheckExitData)
    }
    if(isRight) {
      setHasRightData(undefined);
    }
  }

  const getContactInfo = async(contactId?: string) => {
    if(!contactId) {
      message.error('联系人信息异常！');
      return;
    }
    const res = await getCustomerContactInfo(contactId);
    if(res?.contactId && onContactRecordChange) {
      onContactRecordChange(res)
    }
  }
  // 当前校验（type --- 校验类型， phone -- 手机号，right---联系人查看权限）
  const handleTargetContactInfo = async(type: 'phone' | 'right') => {
    const targetContactId = type === 'phone' ? checkIsExitData.contactId : hasRightData?.contactId
    const right = await checkCurrent(targetContactId);
    setFormItemSpinning(true);
    if(right) {
      // 清空表单
      formProps.resetFields();
      // 具有权限，先获取客户联系人信息，并清空校验数据
      await getContactInfo(targetContactId);
      resetCheckData(true, true);
    } else {
      showModalInfo({
        content: '您无权限查看此联系人档案。如需申请联系人资源，请联系管理员。',
      })
    }
    setFormItemSpinning(false);
  }
  const phoneExtraRender = () => {
    if(checkIsExitData.isExist) {
      return !contactRecord ? (
        <span className={styles.extraContent}>
          如需设置联系人所在部门等信息，请点击：<a onClick={() => handleTargetContactInfo('phone')}>查看联系人信息</a>
        </span>
      ) : (
        <span className={styles.extraContent}>
          {/* 此手机号已关联了联系人档案。 */}
          ①请输入新的手机号；
          ②或<a onClick={() => handleTargetContactInfo('phone')}>【查看此手机关联的联系人档案】</a>
        </span>
      );
    }
    if(hasRightData) {
      return (
        <span className={styles.extraContent}>
          {/* 此手机号已关联了联系人档案。 */}
          ①请输入新的手机号；
          ②或<a onClick={() => handleTargetContactInfo('right')}>【查看此手机关联的联系人档案】</a>
        </span>
      )
    }
    return '';
  }
  const contactInfoItem: FormListProps = {
    0: [
      {
        title: '姓名',
        dataIndex: 'contactName',
        rules: [{ required: true, message: '请输入姓名' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={10} placeholder="输入联系人姓名，最多10字"/>),
      },
      {
        title: '性别',
        dataIndex: 'sex',
        rules: [{ required: true, message: '请选择性别' }],
        colLayoutObj: longItemColLayoutObj,
        component: (
          <Radio.Group>
            {Object.keys(genderType).map(k => (
              <Radio key={k} value={genderType[k].id} style={{ width: 50 }}>
                {genderType[k].text}
              </Radio>
            ))}
          </Radio.Group>
        ),
      },
      {
        title: '手机',
        dataIndex: 'mobilePhone',
        ishide: (phoneNumberEditable || !contactRecord),
        colLayoutObj: longItemColLayoutObj,
        component: (
          <>
            <span>***********</span>
            <a style={{ margin: '0 10px' }} onClick={() => handleToDecrypt()}><FormOutlined /></a>
          </>
        ),
      },
      {
        title: '手机',
        dataIndex: 'mobilePhone',
        rules: [
          { required: true, message: '请输入' },
          {
            validator: async(rule, value) => {
              if (!value || value === currentPhoneRecord) {
                resetCheckData(true, true);
                return Promise.resolve();
              }
              if(value && !phoneCheck.pattern.test(value)) {
                resetCheckData(true, true);
                return Promise.reject('手机格式错误');
              }
              if(contactRecord?.contactId &&
                value === currentPhoneRecord) {
                resetCheckData(true, false);
                return checkHasOperateContactRight(contactRecord.contactId);
              }
              resetCheckData(false, true);
              return checkIsPhoneExit(value);
            },
          },
        ],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input placeholder="联系人手机号码" />),
        extra: phoneExtraRender(),
        ishide: !(phoneNumberEditable || !contactRecord),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        colLayoutObj: longItemColLayoutObj,
        rules: [{ ...emailCheck },],
        component: (<Input placeholder="联系人邮箱账号" />),
      },
      {
        title: '职位',
        dataIndex: 'position',
        rules: [{ required: true, message: '请输入' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={10} placeholder="输入联系人职位，最多10字" />),
      },
      {
        title: '主要职责',
        dataIndex: 'duty',
        rules: [{ required: true, message: '请输入' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={100} placeholder="输入联系人职责，最多100字" />),
      },
      {
        title: '城市',
        dataIndex: 'address',
        rules: [{ required: true, message: '请输入' }, {...allSpaceCheck}],
        colLayoutObj: longItemColLayoutObj,
        component: (<Input maxLength={10} placeholder="输入联系人所在城市"/>),
      },
      {
        title: '部门',
        dataIndex: 'departmentIds',
        rules: [{ required: true, message: '请输入' }],
        colLayoutObj: longItemColLayoutObj,
        component: (
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={(departmentsTreeData[0] &&departmentsTreeData[0].children) || []}
            fieldNames={{
              label: 'title',
              value: 'key',
              children: 'children',
            }}
            placeholder="请选择部门"
            treeDefaultExpandAll
            multiple
            showCheckedStrategy="SHOW_ALL"
          />
        ),
      },
      {
        title: '分配给',
        dataIndex: 'assignees',
        colLayoutObj: longItemColLayoutObj,
        component: (
          <RoleBelonger
            style={{ width: '100%' }}
            labelInValue
            multiple={true}
            placeholder="输入销售人员姓名查找，可多选"
          />
        ),
        ishide: !!contactRecord,
      },
    ],
  }
  return (
    <Spin spinning={formItemSpinning}>
      {formListRender(contactInfoItem).map((listItem: any) => listItem)}
    </Spin>
  );
};

export default connect(({ customer, user }: ConnectState) => ({
  departmentsTreeData: customer.departmentsTreeData || [],
  currentUser: user.currentUser,
}))(CustomerContactInfo);