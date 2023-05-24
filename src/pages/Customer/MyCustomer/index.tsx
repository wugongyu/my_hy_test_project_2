import { commonPagination } from "@/config/common";
import type { CommonTableListParams } from "@/services/data";
import { handleFormatTableData } from "@/utils/utils";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { CustomerListItem } from "../data";
import { customerTableColumns, customerTableColumnsSearchItem, handleToCustomerDetails } from "../handler";
import { getMyCustomersList } from "../service";

const MyCustomerList: React.FC<{}> = () => {
  const columns: ProColumns<CustomerListItem>[] = [
    ...customerTableColumnsSearchItem,
    ...customerTableColumns(true),
    {
      title: '操作',
      width: 120,
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="details" onClick={() => handleToCustomerDetails(true, record)}>详情</a>
      ],
    },
  ];
  const fetchList = async(params: CommonTableListParams) => {
    const { current = 1, pageSize = 10, ...rest } = params; 
    const currentParams: CommonTableListParams = {
      current,
      pageSize,
      ...rest,
    };
    const res = await getMyCustomersList(currentParams);
    return handleFormatTableData(res);
  }
  return (
    <>
      <ProTable 
        headerTitle=""
        rowKey='customerId'
        columns={columns}
        pagination={commonPagination}
        request={async (params: CommonTableListParams) => fetchList(params)}
      />
    </>
  );
};

export default MyCustomerList;