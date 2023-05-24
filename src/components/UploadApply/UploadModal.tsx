import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Upload } from 'antd';
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

export interface UploadApplyProps {
  onRefresh?: (flag: boolean, result?: ResultProps) => void;
  /** 弹窗标题 */
  modalTitle?: React.ReactNode | string;
  /** 弹窗宽度 */
  modalWidth?: number | string;
  /** 导入按钮标题 */
  buttonTitle?: React.ReactNode | string;
  /** 导入标题名称 */
  importLabel?: React.ReactNode | string;
  /** 导入说明 */
  importDesc?: React.ReactNode | string;
  /** 上传相关属性 */
  uploadProps: UploadProps;
  /**
   * 一个获得 上传结果 的方法
   */
  uploadRequest: (file?: UploadFile | null) => Promise<ResultProps>;
  /** 下载错误文件 */
  onDownloadErrorRender?: (result: ResultProps) => React.ReactNode | string;
}

const UploadModal: React.FC<UploadApplyProps> = props => {
  const {
    children,
    modalTitle,
    buttonTitle,
    importLabel,
    importDesc,
    modalWidth,
    uploadProps,
    uploadRequest,
    onRefresh,
    onDownloadErrorRender,
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<UploadFile | null>(null);
  const [result, setResult] = useState<ResultProps | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  useEffect(() => {
    // 关闭弹窗时，清空相关数据
    if (!visible) {
      setCurrentFile(null);
      setResult(null);
    }
  }, [visible]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  // const handleCancel = () => {
  //   setVisible(false);
  // };

  const fileRender = () => {
    const fileUploadProps = {
      name: 'file',
      ...uploadProps,
      beforeUpload: (file: UploadFile) => {
        setCurrentFile(file);
        return false;
      },
    };
    const handleRemove = () => {
      setCurrentFile(null);
      setResult(null);
    };
    return (
      <div>
        {currentFile ? (
          <div className={styles.fileCurrentStyle}>
            <span>{currentFile.name}</span>
            {!result?.success && ( // 当具体导入成功数据，就不允许删除按钮出现
              <a className={styles.pError} onClick={handleRemove}>
                {' '}
                删除
              </a>
            )}
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

  /**
   * 点击导入按钮，上传文件，取返回值
   * uploadRequest如果存在，则调用自定义，否则采用默认
   */
  const uploadChange = async () => {
    setUploadLoading(true);
    if (uploadRequest) {
      // 自定义
      const res = await uploadRequest(currentFile);
      setResult({ ...res });
    }
    setUploadLoading(false);
  };

  return (
    <div>
      <div onClick={handleClick}>{children}</div>
      <Modal
        title={modalTitle}
        visible={visible}
        width={modalWidth || 520}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          if (result && onRefresh) {
            onRefresh(!!result?.success, result); // 有成功导入的则返回true
          }
        }}
        maskClosable={false}
        footer={
          <Button
            type="primary"
            disabled={!currentFile}
            loading={uploadLoading}
            onClick={() => {
              if (result) {
                // 执行关闭操作
                setVisible(false);
                if (onRefresh) onRefresh(!!result?.success, result); // 有成功导入的则返回true
              } else {
                // 执行导入操作
                uploadChange();
              }
            }}
          >
            {result ? '关闭' : `${buttonTitle || '导入'}`}
          </Button>
        }
      >
        <Row gutter={12}>
          <Col span={6} style={{ textAlign: 'right', padding: '5px 6px' }}>
            {importLabel || '文件导入:'}
          </Col>
          <Col span={15}>
            {fileRender()}
            {importDesc && <p>{importDesc}</p>}
          </Col>
        </Row>
        {result && (
          <Row gutter={12} style={{ marginTop: 20 }}>
            <Col span={6} style={{ textAlign: 'right' }}>
              {importLabel || '导入结果:'}
            </Col>
            {result.errMessage ? (
              <Col span={15}>
                <p>{result.errMessage}</p>
              </Col>
            ) : (
              <Col span={15}>
                <p className={`${styles.pstyle}`}>
                  <span className={styles.pSuccess}>成功</span>
                  {result.success || 0}条记录
                </p>
                <p className={styles.pstyle}>
                  <span className={styles.pError}>失败</span>
                  {result.error || 0}条记录
                </p>
                {result.error && onDownloadErrorRender ? (
                  <p className={styles.pstyle}>{onDownloadErrorRender(result)}</p>
                ) : null}
              </Col>
            )}
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default UploadModal;
