/**
 * 批量导入授权商品
 * */ 

import { UploadResult, UploadSignFile } from '@/components/UploadApply';
import type { ResultProps } from '@/components/UploadApply/UploadModal';
import { DownloadOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, message, Modal, Row } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import styles from '../index.less';
import { exportFailFile } from '@/services/global';
import { batchImportAuthorizedProducts, importAuthorizedProductsTemplate } from '../../service';
 
export interface BatchImportAccountPointsProps {
  dataAuthorizationId: string | number;
  modalTitle: string; // 弹窗标题
  onRefresh?: (flag: boolean, result?: ResultProps) => void; // /** 完成刷新 回调函数 */
 }
 
 const BatchImportAuthorizedProducts: React.FC<BatchImportAccountPointsProps> = props => {
   const { children, modalTitle, onRefresh, dataAuthorizationId } = props;
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [currentFile, setCurrentFile] = useState<UploadFile | undefined>(); // 当前上传的文件
   const [fileErrorMsg, setFileErrorMsg] = useState<string>(''); // 当前上传的错误提示
   const [result, setResult] = useState<ResultProps>({}); // 当前上传结果
   const [loading, setLoading] = useState<boolean>(false); // 上传文件按钮loading
   const [exportExcelErrorLoading, setExportExcelErrorLoading] = useState<boolean>(false); // 导出错误文件的loading
 
   const handleBtnClick = (e: any) => {
     if(!(dataAuthorizationId || dataAuthorizationId === 0)) {
       message.error('请先选中授权对象后再进行授权商品的导入！');
       return;
     }
     e.stopPropagation();
     setModalVisible(true);
   };
   useEffect(() => {
     if (currentFile && !/.+\.(xls|xlsx)$/.test(currentFile.name)) {
       setFileErrorMsg('文件格式错误，只允许导入表格文件后缀名.xlsx、.xls');
     } else {
       setFileErrorMsg('');
     }
     setResult({});
   }, [currentFile]);
 
   // 初始化数据
   const initData = () => {
     setCurrentFile(undefined);
     setFileErrorMsg('');
     setResult({});
     setLoading(false);
   };
   // 关闭弹窗后初始化数据
   const handleClose = () => {
     setModalVisible(false);
     if (onRefresh) onRefresh((!!result?.success), result);
     initData();
   };
   // 下载导入模板
   const downloadTemplate = async () => {
     try {
       const res = await importAuthorizedProductsTemplate();
       FileSaver.saveAs(res, '授权品种导入模板.xlsx');
     } catch(err) {
       message.error('下载模板失败！');
     }
   };
   // 选择文件上传
   const handleFileChange = (file?: UploadFile) => {
     setCurrentFile(file);
   };
   // 导入操作
   const handleImport = async () => {
     if (!currentFile) {
       message.error('导入文件不能为空噢！');
       return;
     }
     if (fileErrorMsg) {
       message.error(fileErrorMsg);
       return;
     }
     setLoading(true);
     const formData = new FormData();
     formData.append('file', currentFile as any);
     const res = await batchImportAuthorizedProducts(dataAuthorizationId, formData);
     if (res &&( res?.failCount || res?.successCount)) {
       // 导入成功/失败
       const { successCount = 0, failCount = 0, failFileKey, ...restData } = res;
       setResult({
         success: successCount,
         error: failCount,
         total: successCount + failCount,
         id: failFileKey,
         ...restData,
       });
     } else {
       setFileErrorMsg(`${res?.message || '导入失败'}`);
       message.error(`${res?.message || '导入失败'}`);
     }
     setLoading(false);
   };
   // 下载导入失败数据
   const downloadErrorExcel = async (id: string) => {
     if(!id) {
       message.error('数据异常，不可下载！');
       return;
     }
     setExportExcelErrorLoading(true);
     const res = await exportFailFile(id);
     const reader = new FileReader();
     reader.readAsText(res);
     reader.onload = (readerResult: any) => {
       try {
         const resData = JSON.parse(readerResult?.target?.result); // 解析对象成功，说明是json数据
         if (resData) {
           message.error(resData?.message || '下载失败');
         }
       } catch (err) {
         // 解析成对象失败，说明是正常的文件流, 直接下载保存即可
         FileSaver.saveAs(res, '授权品种表（失败数据）.xlsx');
       }
     };
     setExportExcelErrorLoading(false);
   };
   // 文件导入
   const fileUpload = () => {
     const importLabelRender = (
       <>
         <PlusOutlined />
         添加文件：
       </>
     );
     return (
       <div className={styles.fileUploadContent}>
         <div className={styles.fileUploadContentTitle}>
            <p>导入授权品种（按以下步骤操作）</p>
         </div>
         <div className={styles.fileTemplateText}>
            <p>
              1、<a onClick={downloadTemplate}>下载模板表格；</a>
            </p>
            <p>2、按模板表格要求填写好需导入的药品信息；</p>
            <p>3、点击【选择文件】上传第2步制作好的表格；</p>
            <p>4、点击【确定】，系统开始执行导入，导入时请勿关闭此窗口。</p>
         </div>
         <UploadSignFile
           value={currentFile}
           onChange={handleFileChange}
           uploadProps={{ accept: '.xls, .xlsx' }}
           importLabel={importLabelRender}
         />
         {fileErrorMsg && (
           <Row>
             <span className={styles.alertText}>{fileErrorMsg} </span>
           </Row>
         )}
       </div>
     );
   };
 
   // 下载失败数据
   const onDownloadErrorRender = () => (
     <a onClick={() => downloadErrorExcel(result.id)}>
       {exportExcelErrorLoading ? <SyncOutlined spin /> : <DownloadOutlined />}
       点击查看导入失败原因
     </a>
   );
 
   /** 导入结果 */
   const importResult = () => (
     <div className={styles.batchImportResult}>
        <UploadResult result={result} onDownloadErrorRender={onDownloadErrorRender} />
     </div>
   );
 
   // 底部按钮渲染
   const renderFooter = () => (
     <>
       {Object.keys(result).length > 0 ? (
         <Button type="primary" onClick={() => handleClose()}>
           {result?.success ? '完成' : '关闭'}
         </Button>
       ) : (
         <Button
           loading={loading}
           type="primary"
           disabled={!currentFile}
           onClick={() => handleImport()}
         >
           {loading ? '正在提交，请勿关闭此窗口……' : '提交'}
         </Button>
       )}
     </>
   );
   return (
     <>
       {/* 弹窗出现按钮 */}
       <span onClick={handleBtnClick}>{children}</span>
       <Modal
         title={modalTitle}
         visible={modalVisible}
         destroyOnClose
         maskClosable={false}
         onCancel={() => handleClose()}
         footer={renderFooter()}
         width={600}
       >
         <div>
           {fileUpload()}
           {Object.keys(result).length > 0 && importResult()}
         </div>
       </Modal>
     </>
   );
 };
 
 export default BatchImportAuthorizedProducts;
 