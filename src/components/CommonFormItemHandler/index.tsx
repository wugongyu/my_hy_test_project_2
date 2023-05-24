/**
 * 通用的表单项处理方法组件
 * */ 

import { Col, Form, Row } from "antd";
import type { Rule } from "antd/lib/form";
import type { ReactNode } from "react";

export interface FormSignalProps {
  title?: string | ReactNode;
  dataIndex?: string | string[];
  rules?: Rule[];
  component?: string | ReactNode;
  children?: string | ReactNode;
  extra?: string | ReactNode;
  ishide?: boolean; // 是否不展示
  isCustomFormItem?: boolean; // 自定义formItem
  [key: string]: any;
}

export type FormListProps = Record<string, FormSignalProps[]>;

export const colLayout = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 8,
};
export const longItemColLayoutObj = { span: 24 };

 
 // 将相关的信息转换为表单信息
export const formListRender = (dataList: FormListProps) => {
  const formRender: any = [];
  Object.keys(dataList).forEach((key: string) => {
    formRender.push(
      <Row key={key}>
        {dataList[key].map((item: FormSignalProps) => {
          const {
            dataIndex,
            title,
            component,
            className,
            colLayoutObj = colLayout,
            ishide,
            isCustomFormItem,
            ...obj
          } = item;
          const formItemProps: any = {
            ...obj,
            label: item.title,
            name: item.dataIndex,
          };
          if(ishide) return null;
          if(isCustomFormItem) return (
            <Col {...colLayoutObj} key={item.dataIndex}>
              {item.component}
            </Col>
          )
          return (
            <Col {...colLayoutObj} key={item.dataIndex}>
              <Form.Item {...formItemProps} className={className}>
                {item.component}
              </Form.Item>
            </Col>
          );
        })}
      </Row>,
    );
  });
  return formRender;
};