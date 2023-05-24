import React from 'react';
import { Row, Col, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import styles from './index.less';

export interface ResultProps {
  success?: number;
  error?: number;
  total?: number;
  /** 错误提示：如果存在错误提示，则不展示成功和失败条数 */
  errMessage?: React.ReactNode | string;
  [key: string]: any;
}

export interface UploadSignFileProps {
  /** 导入按钮标题 */
  buttonTitle?: React.ReactNode | string;
  /** 导入标题名称 */
  importLabel?: React.ReactNode | string;
  /** 导入说明 */
  importDesc?: React.ReactNode | string;
  /** 上传相关属性 */
  uploadProps?: UploadProps;
  /** 当前上传的文件 */
  value?: UploadFile;
  /**
   * 返回选择的文件
   */
  onChange?: (file?: UploadFile) => void;
  importStyle?: 'basic' | 'descFirst'; // basic---导入文件文案优先展示（默认）， descFirst--导入说明优先展示
}

const UploadSignFile: React.FC<UploadSignFileProps> = props => {
  const { importLabel, importDesc, uploadProps, value, onChange, importStyle = 'basic' } = props;

  const fileRender = () => {
    const fileUploadProps = {
      name: 'file',
      ...uploadProps,
      beforeUpload: (file: UploadFile) => {
        if (onChange) onChange(file);
        return false;
      },
    };
    const handleRemove = () => {
      if (onChange) onChange();
    };
    return (
      <div>
        {value ? (
          <div className={styles.fileCurrentStyle}>
            <span>{value.name}</span>
            <a className={styles.pError} onClick={handleRemove}>
              {' '}
              删除
            </a>
          </div>
        ) : (
          <div style={{ padding: '5px 6px' }}>
            <Upload {...fileUploadProps}>
              <a>选择文件</a>
            </Upload>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {importStyle === 'basic' && (
        <Row gutter={12}>
          <Col span={6} style={{ textAlign: 'right', padding: '5px 6px' }}>
            {importLabel || '文件导入:'}
          </Col>
          <Col span={15}>
            {fileRender()}
            {importDesc && <p>{importDesc}</p>}
          </Col>
        </Row>
      )}
      {importStyle === 'descFirst' && (
        <div style={{ padding: 24 }}>
          <Row gutter={12}>{importDesc && <div>{importDesc}</div>}</Row>
          <Row>
            <span style={{ lineHeight: '32px' }}>{importLabel || '文件导入:'}</span>
            {fileRender()}
          </Row>
        </div>
      )}
    </div>
  );
};

export default UploadSignFile;
