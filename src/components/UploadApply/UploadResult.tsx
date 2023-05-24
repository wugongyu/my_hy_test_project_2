import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export interface UploadResultMessage {
  success?: number;
  error?: number;
  total?: number;
  /** 错误提示：如果存在错误提示，则不展示成功和失败条数 */
  errMessage?: React.ReactNode | string;
  [key: string]: any;
}

export interface UploadResultProps {
  label?: string;
  result: UploadResultMessage;
  /** 下载错误文件 */
  onDownloadErrorRender?: (result: UploadResultMessage) => React.ReactNode | string;
  isCustomResultInfoRender?: boolean; // 是否自定义展示导入结果
}

// 自定义展示的导入结果
export const customResultInfoRender = (result?: UploadResultMessage) => {
  return (
    <>
      {!!result?.error && (
        <p className={styles.batchImportResultInfoText}>
          导入失败！其中有{result.error}条记录信息填写不规范，请下载失败数据，按提示填写好再导入。
        </p>
      )}
      {!!result?.success && !result?.error && (
        <>
          <p className={`${styles.pstyle}`}>
            <span className={styles.pSuccess}>成功 </span>
            {result.success || 0} 条记录
          </p>
          <p className={styles.pstyle}>
            <span className={styles.pError}>失败 </span>
            {result.error || 0} 条记录
          </p>
        </>
      )}
    </>
  );
};

const UploadResult: React.FC<UploadResultProps> = props => {
  const { result, label, onDownloadErrorRender, isCustomResultInfoRender } = props;

  return (
    <Row gutter={12} style={{ marginTop: 20 }}>
      <Col span={6} style={{ textAlign: 'right' }}>
        {label || '导入结果:'}
      </Col>
      {result.errMessage ? (
        <Col span={15}>
          <p style={{ color: '#ff4d4f' }}>{result.errMessage}</p>
        </Col>
      ) : (
        <Col span={15}>
          {!isCustomResultInfoRender && (
            <>
              <p className={`${styles.pstyle}`}>
                <span className={styles.pSuccess}>成功 </span>
                {result.success || 0} 条记录
              </p>
              <p className={styles.pstyle}>
                <span className={styles.pError}>失败 </span>
                {result.error || 0} 条记录
              </p>
            </>
          )}
          {isCustomResultInfoRender && <>{customResultInfoRender(result)}</>}
          {result.error && onDownloadErrorRender ? (
            <p className={styles.pstyle}>{onDownloadErrorRender(result)}</p>
          ) : null}
        </Col>
      )}
    </Row>
  );
};

export default UploadResult;
