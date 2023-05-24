/**
 * 数据授权列表操作按钮
 * */
import ListActionBtnsRender from "@/components/CommonListActionBtnsRender";
import CommonLogModal from "@/components/CommonLogModal";
import { logTableNameEnums } from "@/config/logConfig";
import { message } from "antd";
import { connect, history } from "umi";
import { useState } from "react";
import { v4 } from 'uuid';
import type { AuthorizationListItem } from "../data";
import type { AuthorizedPersonModalDataProps} from "../DataAuthorization";
import { initAuthorizedPersonModalData } from "../DataAuthorization";
import HandleAuthorizedPerson from "./HandleAuthorizedPerson";
import type { ConnectState } from "@/models/connect";
import type { CommonEnumsProps } from "@/services/data";
import { enumNames } from "@/config/globalEnumsConfig";
import { changeEnumsListToObj } from "@/utils/handleEnumsUtil";

interface AuthorizationListActionProps {
  rowRecord: AuthorizationListItem;
  refreshList: (resetPageFlag: boolean) => void; // 操作完成后的刷新列表回调函数
  globalEnums: CommonEnumsProps[];
}
const AuthorizationListAction: React.FC<AuthorizationListActionProps> = (props) => {
  const { rowRecord, refreshList, globalEnums } = props;
  const [logModalVisible, setLogModalVisible] = useState<boolean>(false);
  const [authorizedPersonModalData, setAuthorizedPersonModalData] = useState<AuthorizedPersonModalDataProps>(initAuthorizedPersonModalData);
  const statusEnums = changeEnumsListToObj({ totalEnums: globalEnums, enumName: enumNames.AUTHORIZED_STATUS_ENUM });
  const handleStatusText = rowRecord.authorizedStatus === statusEnums?.Enable?.id ? '停用' : '启用';
  const handleStatus = () => {
    const handleType = rowRecord.authorizedStatus === statusEnums?.Enable?.id ? 'stop' : 'start';
    setAuthorizedPersonModalData({
      visible: true,
      handleType,
      data: [rowRecord],
    })
  }
  const handleToEdit = () => {
    history.push(`/reports/authorization/edit/${rowRecord.dataAuthorizationId}/${v4()}`);
  }
  const menuClick = (key: string) => {
    if(!(rowRecord && rowRecord?.dataAuthorizationId)) {
      message.error('数据id不存在！');
      return;
    }
    switch(key) {
      case 'handleStatus':
        handleStatus();
        break;
      case 'edit':
        handleToEdit();
        break;
      case 'log':
        setLogModalVisible(true);
        break;
      default:
        break;
    }
  }
  const handleCloseModalAndRefreshList = (flag: boolean) => {
    setAuthorizedPersonModalData(initAuthorizedPersonModalData);
    if(flag) {
      refreshList(false);
    }
  }
  const actionBtns = {
    HANDLE_STATUS: {
      key: 'handleStatus',
      text: handleStatusText,
      isShow: true,
      component: <a style={{ color: rowRecord.authorizedStatus === statusEnums?.Enable?.id ? 'red' : 'green' }}  onClick={() => menuClick('handleStatus')}>{handleStatusText}</a>
    },
    EDIT: {
      key: 'edit',
      text: '编辑',
      isShow: true,
    },
    LOG: {
      key: 'log',
      text: '日志',
      isShow: true,
    }
  };
  return (
    <>
      <ListActionBtnsRender 
        btns={actionBtns}
        menuClick={menuClick}
      />
      {logModalVisible && (
        <CommonLogModal 
          logVisible={logModalVisible}
          onVisibleChange={setLogModalVisible}
          primaryKey={rowRecord.dataAuthorizationId}
          tableName={logTableNameEnums.DATA_AUTHORIZATION_LOG.value}
        />
      )}
      {authorizedPersonModalData?.visible && (
        <HandleAuthorizedPerson 
          targetStatusValue={authorizedPersonModalData.handleType === 'start' ? statusEnums?.Enable?.id : statusEnums?.Disable?.id }
          visible={authorizedPersonModalData?.visible}
          onVisibleChange={handleCloseModalAndRefreshList}
          selectedData={authorizedPersonModalData.data}
          handleType={authorizedPersonModalData.handleType}
        />
      )}
    </>
  );
};

export default connect(({ enums }: ConnectState) => ({
  globalEnums: enums.globalEnums || [],
}))(AuthorizationListAction);


