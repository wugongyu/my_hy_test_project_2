/**
 * 授权明细（新增/编辑授权）
 * */
import type { MatchDataProps } from "@/services/data";
import { Card, Col } from "antd";
import EditableAuthorizationForm from "./components/EditableAuthorizationForm";


interface AuthorizationDetailProps {
  match: MatchDataProps;
}

const AuthorizationDetail: React.FC<AuthorizationDetailProps> = (props) => {
  const { match } = props;
  const { params } = match;
  return (
    <Card>
      <Col span={3} style={{ textAlign: 'right', marginBottom: 10, paddingRight: 10 }}>
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{params.id ? '编辑授权' : '新增授权'}</span>
      </Col>
      <EditableAuthorizationForm 
        match={match}
      />
    </Card>
  );
};

export default AuthorizationDetail;