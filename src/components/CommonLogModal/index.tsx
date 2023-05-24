/**
 * 通用日志弹窗
 *  第一步：在@/config/logConfig中的logTableNameEnums配置好相关内容
 *  第二步：在自己的界面引入日志组件
 * */ 
import { commonPagination } from '@/config/common';
import type { CommonTableListParams } from '@/services/data';
import { getCommonLogs } from '@/services/global';
import { handleFormatTableData } from '@/utils/utils';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Alert, Button, Modal } from 'antd';
import styles from './index.less';

export interface LogModalDataProps {
  primaryKey: string;
  content: string;
  logType: number;
  operateType: number;
  operatorTime: string;
  operatorName: string;
}

export interface CommonLogModalProps {
  logVisible: boolean;
  onVisibleChange: (val: boolean) => void;
  primaryKey: string; // 业务主键
  tableName: string; // 业务表名
  footerCloseBtn?: boolean;
  wrapClassName?: string;
  logTitle?: string;
  modalWidth?: number;
  onRefresh?: () => void;
  tableHeaderRender?: string | React.ReactNode;
  tableColumns?: ProColumns<LogModalDataProps>[];
  titleRender?: React.ReactNode;
}

export const defaultColumns: ProColumns<LogModalDataProps>[] = [
  {
    title: '操作时间',
    dataIndex: 'operatorTime',
    width: 160,
    valueType: 'dateTime',
  },
  {
    title: '操作人',
    width: 120,
    dataIndex: 'operatorName',
  },
  {
    title: '操作内容',
    dataIndex: 'content',
  },
];

const CommonLogModal: React.FC<CommonLogModalProps> = (props) => {
  const { wrapClassName, logVisible, logTitle, 
    onVisibleChange, onRefresh, modalWidth = 800, footerCloseBtn,
    tableHeaderRender, tableColumns = defaultColumns, primaryKey,
    tableName, titleRender } = props;
  const handleCloseModal = (flag: boolean = false) => {
    onVisibleChange(false);
    if(flag && onRefresh) {
      onRefresh();
    }
  }
  const fetchList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      tableName,
      primaryKey,
      ...rest,
    };
    const res = await getCommonLogs(currentParams);
    return handleFormatTableData(res, true);
  }
  const footerRender = footerCloseBtn ? (
    <Button type="primary" onClick={() => handleCloseModal()}>
      关闭
    </Button>
  ) : null;
  return (
    <Modal
      destroyOnClose
      title={logTitle || '日志'}
      maskClosable
      width={modalWidth}
      visible={logVisible}
      wrapClassName={`${styles.logModal} ${wrapClassName}`}
      footer={footerRender}
      onCancel={() => handleCloseModal(false)}
    >
      {titleRender && (
          <Alert message={titleRender} type="success" className="alert-title" />
        )}
      <ProTable 
        className="log-table"
        headerTitle={tableHeaderRender}
        rowKey="uid"
        columns={tableColumns}
        options={false}
        search={false}
        pagination={commonPagination}
        request={async (params: CommonTableListParams) => fetchList(params)}
      />    
    </Modal>
  );
}

export default CommonLogModal;