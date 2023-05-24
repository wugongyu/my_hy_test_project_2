/**
 * 授权列表查询表单项
 * */
import { handleParamsFilterNull } from "@/utils/utils";
import type { FormInstance} from "antd";
import { Button, Form, Input, Col, Row } from "antd";
import { useState } from "react";
import { DrugInfoItem } from "../../data";
import { handleSearchTableData } from "../handler";
import styles from '../index.less';
 
interface SearchFormItemProps {
  formProps: FormInstance;
  onTableLoading: (val: boolean) => void;
  tableData: DrugInfoItem[];
  onTableDataChange: (data: DrugInfoItem[]) => void;
  allData: DrugInfoItem[];
}

export const colLayout = {
  xs: 6,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 6,
  xxl: 6,
};
const SearchFormItem: React.FC<SearchFormItemProps> = (props) => {
  const { formProps, onTableLoading, onTableDataChange, allData } = props;
  const [searchBtnLoading, setSearchBtnLoading] = useState<boolean>(false);
  const handleSearch = async() => {
    setSearchBtnLoading(true);
    onTableLoading(true);
    const currentParams = formProps?.getFieldsValue();
    const res = await handleSearchTableData({ list: allData, params: handleParamsFilterNull(currentParams) });
    onTableDataChange(res);
    setSearchBtnLoading(false);
    onTableLoading(false);
  }
  return (
    <div>
      <Form
        labelCol={{ span: 4}}
        wrapperCol={{ span: 24 }}
        layout="inline"
        form={formProps}
        className={styles.searchFormItem}
      >
        <Row>
          <Col span={7}>
            <Form.Item name="productId">
              <Input allowClear placeholder="输入药品编号查找" title="输入药品编号查找" onPressEnter={handleSearch} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="productName">
              <Input allowClear placeholder="输入药品名称查找" title="输入药品名称查找" onPressEnter={handleSearch} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="manufacturerName">
              <Input allowClear placeholder="输入生产企业查找" title="输入生产企业查找" onPressEnter={handleSearch} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Button type="primary" onClick={() => handleSearch()} loading={searchBtnLoading}>查询</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchFormItem;