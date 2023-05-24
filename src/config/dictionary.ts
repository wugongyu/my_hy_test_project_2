export type StatusProps = Record<
  string,
  {
    text: string;
    color?: string;
    status?: string;
    [key: string]: any;
  }
>;

/**
 * 将枚举值转为table enum 的格式{value: { text: '', [key: string]: any }}
 */
export const basicDictionaryToTableFormatEnums = (fields: string[], statusObj: StatusProps) => {
  const obj = {};
  fields.forEach((item) => {
    // 一对多的状态名用“|”分隔，传进来时分割开来
    const arr = item.split('|');
    if (arr.length > 1) {
      // 对应的是多个状态名时，将id值用逗号拼接起来
      let idStr = '';
      arr.forEach((v) => {
        if (statusObj[v]) {
          idStr += `${statusObj[v].id},`;
        }
      });
      if (idStr) {
        const { id, ...other } = statusObj[arr[0]];
        // 去除idStr中的最后一个逗号
        obj[idStr.slice(0, idStr.length - 1)] = { ...other };
      }
    } else if (statusObj[item]) {
      // 单个状态名时不用拼接id
      const { id, ...other } = statusObj[item];
      obj[id] = { ...other };
    }
  });
  return obj;
};

export const globalTableScroll = {
  x: 1200,
  y: 600,
};

// 通用table查询表单的列数配置
export const defaultColConfig = {
  xs: 8,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 4,
  xxl: 4,
};
export const basicApprovalStatusType: StatusProps = {
  await_approval: { id: 1, text: '待审核' },
  pass: { id: 2, text: '审核通过' },
  reject: { id: 3, text: '审核不通过' },
};
export const approvalStatusType = {
  ...basicDictionaryToTableFormatEnums(
    ['await_approval', 'pass', 'reject'],
    basicApprovalStatusType,
  ),
};
export const defaultPageSize = 5;

export const genderType: StatusProps = {
  male: { id: 1, text: '男' },
  female: { id: 2, text: '女' },
}


export const genderTypeForTable = {
  ...basicDictionaryToTableFormatEnums(
  ['male', 'female'],
  genderType,
),}
// 部门树类型
export const departmentsTreeType: StatusProps = {
  DEPARTMENT: { id: 1, text: '部门' },
  MEMBER: { id: 2, text: '成员' },
}

// 审核类型枚举
export const auditTypeEnums: StatusProps = {
  PASS: { id: 1, text: '通过' },
  UN_PASS: { id: 2, text: '不通过' },
}
