/**
 * 通讯录
 * */ 
import { useEffect, useState } from "react";
import type { Dispatch } from "umi";
import { connect } from "umi";
import type { CustomerContactListItem } from "../../data";
import styles from '../index.less';
import CustomerContactsList from "./CustomerContactsList";
import CustomerDepartments from "./CustomerDepartments";

export interface CommunicationBookProps {
  type: string;
  customerId: string;
  dispatch: Dispatch;
}

const CommunicationBook: React.FC<CommunicationBookProps> = (props) => {
  const { customerId, dispatch, type } = props;
  const [currentSelecteContactData, setSelectedContactData] = useState<CustomerContactListItem[]>([]);
  const [pageRefreshFlag, setPageRefreshFlag] = useState<boolean>(false);
  useEffect(() => {
    if(customerId) {
      dispatch({
        type: 'customer/fetchCustomerDepartments',
        payload: customerId,
      });
      setPageRefreshFlag(false);
    }
  }, [customerId, pageRefreshFlag]);
  return (
    <div className={styles.communicationBook}>
      <div className={styles.customerDepartments}>
        <CustomerDepartments 
          customerId={customerId}
          pageRefreshFlag={pageRefreshFlag}
          onPageRefreshChange={setPageRefreshFlag}
          selectedContactData={currentSelecteContactData}
          onSelectedContactDataChange={setSelectedContactData}
          type={type}
        />
      </div>
      <div className={styles.customerContactsList}>
        <CustomerContactsList 
          customerId={customerId}
          pageRefreshFlag={pageRefreshFlag}
          onPageRefreshChange={setPageRefreshFlag}
          selectedContactData={currentSelecteContactData}
          onSelectedContactDataChange={setSelectedContactData}
          type={type}
        />
      </div>
    </div>
  );
};

export default connect()(CommunicationBook);