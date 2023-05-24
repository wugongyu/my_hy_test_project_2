/**
 * 添加授权商品弹窗
 * */ 
import { Modal } from 'antd';
import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from '../index.less';
import type { DrugInfoItem } from '../../data';
import type { CommonTableListParams } from '@/services/data.d';
import { handleFormatTableData } from '@/utils/utils';
import { getProductsList } from '@/services/global';

interface ToAddProductsModalProps {
  visible: boolean;
  onVisibleChange: (flag: boolean) => void;
  productsTableData?: DrugInfoItem[]; // 协议商品列表数据
  onProductsTableChange?: (val: DrugInfoItem[]) => void; // 协议商品列表数据改变时的回调
}
 
const ToAddProductsModal: React.FC<ToAddProductsModalProps> = (props) => {
  const { visible, onVisibleChange, productsTableData = [], onProductsTableChange } = props;
  const [currentSelections, setCurrentSelections] = useState<DrugInfoItem[]>([]);
  const columns: ProColumns<DrugInfoItem>[] = [
    {
      title: 'SKU_ID',
      dataIndex: 'productId',
      className: styles.tableItem,
      fieldProps: {
        placeholder: '输入药品编号查找',
      },
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      hideInSearch: true,
      className: styles.longTableItem,
    },
    {
      title: '通用名',
      dataIndex: 'generalName',
      className: styles.longTableItem,
      fieldProps: {
        placeholder: '输入药品通用名查找',
      },
    },
    {
      title: '批准文号',
      dataIndex: 'approvalNumber',
      className: styles.longTableItem,
      fieldProps: {
        placeholder: '输入批准文号查找',
      },
    },
    {
      title: '规格',
      dataIndex: 'specification',
      hideInSearch: true,
      className: styles.tableItem,
    },
    {
      title: '国际条码',
      dataIndex: 'internationalBarCode',
      hideInSearch: true,
      className: styles.longTableItem,
    },
    {
      title: '上市许可持有人',
      dataIndex: 'drugLicenseHolder',
      hideInSearch: true,
      className: styles.specialLongTableItem,
    },
    {
      title: '生产企业',
      dataIndex: 'manufacturerName',
      hideInSearch: true,
      className: styles.longTableItem,
    },
  ];
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DrugInfoItem[],
  ) => {
    setCurrentSelections(selectedRows);
  };
  // 列表数据
  const fetchList = async(params: CommonTableListParams) => {
    setCurrentSelections([]);
    const { current = 1, pageSize = 10, ...rest } = params;
    const currentParams = {
      current,
      pageSize,
      ...rest,
    };
    const res = await getProductsList(currentParams);
    return handleFormatTableData(res);
    
  }
  // 添加所选商品
  const handleAddSelections = () => {
    const productIds = productsTableData?.map(item => item.productId) || [];
    // 仅筛选已选商品列表中不包含的商品
    const handledFinalData = currentSelections?.filter(item => !productIds.includes(item.productId))
    if(onProductsTableChange) {
      onProductsTableChange([
        ...productsTableData,
        ...handledFinalData,
      ]);
    }
    onVisibleChange(false);
  }
  return (
    <>
      <Modal
        width='80%'
        title="查询商品"
        visible={visible}
        onCancel={() => onVisibleChange(false)}
        maskClosable={false}
        destroyOnClose
        bodyStyle={{ padding: '12px 24px' }}
        okButtonProps={{
          disabled: currentSelections?.length < 1,
        }}
        onOk={handleAddSelections}
      >
        <ProTable<DrugInfoItem>
          headerTitle={null}
          rowKey="productId"
          columns={columns}
          options={false}
          className={`${styles.searchProductsModalTable} ${styles.tableSearchItemWithoutLabel}`}
          request={async(params) => fetchList(params)}
          rowSelection={{
            columnWidth: 60,
            onChange: onRowSelectionChange,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: total => `总共${total}条`,
          }}
          search={{
            defaultColsNumber: 4,
            span: 6,
          }}
          scroll={{
            x: 600,
            y: 500,
          }}
        />
      </Modal>
    </>
  );
}

export default ToAddProductsModal;
