/**
 * 授权药品
 * */ 
import { ResultProps } from "@/components/UploadApply/UploadSignFile";
import { commonPagination } from "@/config/common";
import type { MatchDataProps } from "@/services/data";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, Form, message } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import type { DrugInfoItem } from "../../data";
import styles from '../index.less';
import BatchImportAuthorizedProducts from "./BatchImportAuthorizedProducts";
import SearchFormItem from "./SearchFormItem";
import ToAddProductsModal from "./ToAddProductsModal";

interface AuthorizedProductsTableProps {
  value?: DrugInfoItem[];
  onChange?: (data: DrugInfoItem[]) => void;
  match: MatchDataProps;
  formProps: FormInstance;
}

const AuthorizedProductsTable: React.FC<AuthorizedProductsTableProps> = (props) => {
  const { match: { params }, value = [], onChange } = props;
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [toAddProductsModal, setModalVisible] = useState<boolean>(false);
  const [currentTableData, setTableData] = useState<DrugInfoItem[]>([]);
  const [selectedBatchHandleData, setSelectedTableData] = useState<DrugInfoItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableLoading, setTabelLoading] = useState<boolean>(false);
  // const refreshList = (resetPageFlag: boolean = false) => {
  //   actionRef?.current?.reload();
  //   if(resetPageFlag && actionRef?.current?.reloadAndRest) {
  //     actionRef?.current?.reloadAndRest();
  //   }
  // }
  useEffect(() => {
    setTableData(value)
  }, [value]);
  const handleDelete = (data: DrugInfoItem[]) => {
    const ids = data?.map(item => item.productId);
    const filterData = value?.filter(item => !ids.includes(item.productId));
    if(onChange) {
      onChange(filterData);
    }
    message.success('删除成功！')
    setSelectedTableData([]);
    // refreshList(true);
  }
  const handleSingleDelete = (data: DrugInfoItem) => {
    if(!data.productId) {
      message.error('药品id异常！');
      return;
    }
    handleDelete([data]);
  }
  const handleBatchDelete = () => {
    if(selectedBatchHandleData?.length === 0) {
      message.error('请先选中下方表格数据之后再进行移除操作！');
      return;
    }
    handleDelete(selectedBatchHandleData);
  }
  const columns: ProColumns<DrugInfoItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
      render: (_text, record, index, action) => {
        const { pageInfo } = action || {};
        const { pageSize = 10 } = pageInfo || {};
        return `${pageSize * (currentPage - 1) + index + 1}`;
      },
    },
    {
      title: '药品编号',
      dataIndex: 'productId',
      width: 80,
    },
    {
      title: '药品名称',
      dataIndex: 'productName',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      width: 80,
    },
    {
      title: '生产企业',
      dataIndex: 'manufacturerName',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 80,
      render: (text, record) => (
        <a style={{ color: 'red' }} onClick={() => handleSingleDelete(record)}>
          移除
        </a>
      )
    },
  ];
  const handleToAdd = () => {
    setModalVisible(true);
  }
  const onRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DrugInfoItem[],
  ) => {
    setSelectedTableData(selectedRows);
  };
  const btnsRender = (
    <div className={styles.productsTableheaderActionBtns}>
      <Button type="primary" onClick={() => handleToAdd()}>添加授权商品</Button>
      {/* <Button type="primary">导入授权商品</Button> */}
      <BatchImportAuthorizedProducts 
        dataAuthorizationId={params?.id || 0}
        modalTitle='导入授权商品'
        onRefresh={(flag: boolean, result?: ResultProps) => {
          if(flag && onChange) {
            const currentExitDataIds = value?.map(item => item.productId);
            const filterData = result?.data?.filter((item: { productId: string; }) => !currentExitDataIds?.includes(item.productId)) || []; 
            const handledData = [
              ...value,
              ...filterData,
            ];
            onChange(handledData);
          }
        }}
     >
        <Button type="primary">
          导入授权商品
        </Button>
      </BatchImportAuthorizedProducts>
      <Button danger onClick={() => handleBatchDelete()}>移除授权商品</Button>
    </div>
  )
  const headerTitleRender = () => params?.id ? (
    <div className={styles.productsTableheaderAction}>
      {btnsRender}
      <div className={styles.productsTableheaderActionSearchForm}>
        <SearchFormItem
          formProps={form}
          onTableLoading={setTabelLoading}
          tableData={currentTableData}
          onTableDataChange={setTableData}
          allData={value}
        />
      </div>
    </div>
  ) : <>
    {btnsRender}
    <span
      className='ant-form-item-extra'
    >授权项目涉及的合作品种。仅添加项目内合作品种，无关品种无需添加。</span>
  </>;
  return (
    <>
      <ProTable 
        rowKey="productId"
        actionRef={actionRef}
        dataSource={currentTableData}
        headerTitle={headerTitleRender()}
        className={styles.authorizedProductsTable}
        columns={columns}
        search={false}
        options={false}
        pagination={{
          ...commonPagination,
          current: currentPage,
          onChange: setCurrentPage,
        }}
        rowSelection={{
          selectedRowKeys: selectedBatchHandleData?.map(item => item.productId),
          onChange: onRowSelectionChange,
        }}
        loading={tableLoading}
      />
      {toAddProductsModal && (
        <ToAddProductsModal 
          visible={toAddProductsModal}
          onVisibleChange={setModalVisible}
          productsTableData={value}
          onProductsTableChange={onChange}
        />
      )}
    </>
  );
};

export default AuthorizedProductsTable;
