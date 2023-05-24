import React from 'react';
import { Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';

export interface UploadApplyProps extends UploadProps {
  onChange?: () => void;
}

const UploadApply: React.FC<UploadApplyProps> = props => {
  const { children, ...restProps } = props;

  return <Upload {...restProps}>{children}</Upload>;
};

export default UploadApply;
