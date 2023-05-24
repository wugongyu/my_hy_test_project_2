/**
 * 客户组织架构
 * */
import type { ConnectState } from "@/models/connect";
import { connect } from "umi";
import type { TreeDataProps } from "@/models/customer";
import OrgTree from 'react-org-tree';
import styles from '../index.less';
import ScrollableItem from "@/components/ScrollableItem";

export interface  CustomerStructureProps {
  departmentsTreeData: TreeDataProps[];
}

const CustomerStructure: React.FC<CustomerStructureProps> = (props) => {
  const { departmentsTreeData } = props;
  return (
    <ScrollableItem id="customerStructure" className={styles.customerStructure}>
      {departmentsTreeData && departmentsTreeData[0] && (
        <OrgTree
          data={departmentsTreeData[0]}
          horizontal={false}
          // collapsable={true}
          expandAll={true}
          labelClassName={styles.orgTreeItem}
        />
        )
      }
    </ScrollableItem>
  );
};

export default connect(({ customer }: ConnectState) => ({
  customerDepartments: customer.customerDepartments || [],
  customerInfo: customer.currentCustomerInfo,
  departmentsTreeData: customer.departmentsTreeData || [],
}))(CustomerStructure);