import React from 'react';
import { Result } from 'antd';
import type { IAuthorityType } from './CheckPermissions';
import check from './CheckPermissions';
import type AuthorizedRoute from './AuthorizedRoute';
import type Secured from './Secured';

interface AuthorizedProps {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
}

type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  Secured: typeof Secured;
  check: typeof check;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized: React.FunctionComponent<AuthorizedProps> = ({
  children,
  authority,
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你没有权限查看此页面。"
    />
  ),
}) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized as IAuthorizedType;
