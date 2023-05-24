/**
 * 通用打印组件
 * */ 

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Spin } from 'antd';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

export interface PrintBillProps {
  type?: string; // 类型： 按钮button/表单text/立即执行immediately
  printText?: string; // 打印文案
  onAfterPrint?: () => void; // 回调功能在关闭打印对话框后触发，无论用户选择打印还是取消
  children: React.ReactNode; // 打印的内容组件
  pageStyle?: any; // 页面大小样式 // "@page { size: 2in 5in }"
  handleWaterMarkText?: (val?: string) => void;
}

const PrintBill: React.FC<PrintBillProps> = props => {
  const { type = 'button', onAfterPrint, printText = '打印', children, pageStyle, handleWaterMarkText } = props;

  const componentRef = useRef(null);
  const printRef = useRef(null);
  const onBeforeGetContentResolve = useRef(Promise.resolve);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('预览打印，不作为有效销售凭证');

  /** 回调功能在关闭打印对话框后触发，无论用户选择打印还是取消 */
  const handleAfterPrint = useCallback(() => {
    if (onAfterPrint) onAfterPrint();
  }, []);

  const handleText = (wText?: string) => {
    if(handleWaterMarkText) {
      handleWaterMarkText(wText);
    }
  }

  /**
  * 打印前触发的回调功能。返回void或Promise。
  * 注意：此功能在打印之前立即运行，但在收集页面内容之后才运行。
  * 要在打印之前修改内容，请onBeforeGetContent改用。 */
  const handleBeforePrint = useCallback(() => {
    // eslint-disable-next-line no-console
    // console.log('`onBeforePrint` called');
  }, []);

  /** 在收集页面内容之前触发的回调函数。返回void或Promise。可用于在打印之前更改页面上的内容。 */
  const handleOnBeforeGetContent = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('`onBeforeGetContent` called');
    setLoading(true);
    setText('');
    handleText('')

    return new Promise((resolve: any) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText('');
        handleText('')
        resolve();
      }, 500);
    });
  }, [setLoading, setText]);

  /** 打印的页面内容 */
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: 'AwesomeFileName',
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true, // 执行打印操作后，卸下打印iframe
    pageStyle,
  });

  useEffect(() => {
    if (text === '' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  useEffect(() => {
    if (type === 'immediately') {
      // @ts-ignore
      printRef?.current?.handlePrint();
    }
  }, [type]);

  const buttonRender = () => {
    const renderBtn = {
      button: (
        <Button loading={loading} type="primary" onClick={handlePrint}>
          {printText}
        </Button>
      ),
      text: (
        <a onClick={handlePrint}>
          {loading && <Spin size="small" />}
          {printText}
        </a>
      ),
      immediately: (
        <ReactToPrint
          ref={printRef}
          trigger={() => <span>{}</span>}
          content={() => componentRef.current}
          onAfterPrint={() => {
            if (onAfterPrint) onAfterPrint();
          }}
          pageStyle={pageStyle}
          removeAfterPrint
        />
      ),
    };
    return renderBtn[type];
  };
  return (
    <span >
      <div style={{ width: 0, height: 0, display: 'none' }}>
        <div ref={componentRef}>
          {children}
        </div>
      </div>
      {buttonRender()}
    </span>
  );
};

export default PrintBill;
