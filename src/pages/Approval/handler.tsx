import RoleBelonger from "@/components/RoleBelonger";
import { enumNames } from "@/config/globalEnumsConfig";
import type { CommonEnumsProps } from "@/services/data";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";
import type { ProColumns } from "@ant-design/pro-table";
import { Radio } from "antd";
import { commonIndexColumns } from "../Customer/handler";
import type { ApprovalListItem } from "./data";
import styles from './index.less';

// 状态文案的二次处理
const handleStatusText = (key: string, text: any) => {
  let handledText = text;
  if(key === 'Draft') {
    handledText = '不通过';
  }
  if(key === 'Finished') {
    handledText = '通过';
  }
  if(key === 'Rejected') {
    handledText = '已中止';
  }
  return handledText;

}

export const approvalTableColumns = (params: {
  enums?: CommonEnumsProps[],
  hideCreateUserId?: boolean,
  hideInstanceStatus?: boolean,
  }): ProColumns<ApprovalListItem>[] => {
  const { hideCreateUserId = false, hideInstanceStatus = false, enums } = params;
  const targetStatusEnums = changeEnumsListToObj({ totalEnums: enums, enumName: enumNames.APPROVAL_STATUS });
  // const contextType = changeEnumsListToObj({totalEnums: enums, enumName: enumNames.CONTEXT_TYPE, valueAsKey: true});
  return [
    ...commonIndexColumns,
    {
      title: '审批单号',
      dataIndex: 'approvalCode',
      order: 7,
      colSize: 0.6,
      fieldProps: {
        placeholder: '输入审批单号',
      },
    },
    {
      title: '类型',
      dataIndex: 'instanceName',
      hideInSearch: true,
      // render: (_, record) => {
      //   const { formContext = '' } = record;
      //   const formContextObj = JSON.parse(formContext);
      //   const { type } = formContextObj || {};
      //   return (contextType[type] && contextType[type].text) || '';
      // }
    },
    {
      title: '申请人',
      dataIndex: 'createUserName',
      hideInSearch: true,
    },
    {
      title: '申请人',
      dataIndex: 'createUserId',
      hideInTable: true,
      hideInSearch: hideCreateUserId,
      order: 8,
      colSize: 0.6,
      renderFormItem: () => {
        return (
          <RoleBelonger
            style={{ minWidth: 180 }}
            placeholder="选择申请人"
          />
        )
      },
    },
    {
      title: '申请时间',
      dataIndex: 'creationDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '当前进度',
      dataIndex: 'activityName',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'instanceStatus',
      hideInTable: true,
      hideInSearch: hideInstanceStatus,
      order: 9,
      initialValue: 'all',
      colSize: 2,
      renderFormItem: (item, renderFormItemProps) => {
        return (
          <Radio.Group {...renderFormItemProps} className={styles.processRadio}>
            <Radio value='all' key='all'>
              全部
            </Radio>
            {/* Draft  -  新建（不通过）
                Running   -  审批中
                Finished  -  通过
                Rejected  - 撤销（已中止） */}
            {Object.keys(targetStatusEnums)?.map(key => (
                <Radio value={targetStatusEnums[key].id} key={key}>
                  {handleStatusText(key, targetStatusEnums[key].text)}
                </Radio>
              ))}
          </Radio.Group>
        );
      },
    },
    {
      title: '审批状态',
      dataIndex: 'instanceStatus',
      hideInSearch: true,
      render: (_, record) => {
        const findKey = Object.keys(targetStatusEnums)?.find(key => targetStatusEnums[key].id === record?.instanceStatus);
        if(findKey) {
          return handleStatusText(findKey, targetStatusEnums[findKey].text);
        }
        return '';
      },
    },
  ]
};