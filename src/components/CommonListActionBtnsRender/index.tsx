/**
 * 通用的列表操作按钮组件
 * */ 

import { DownOutlined } from "@ant-design/icons";
import { Divider, Dropdown, Menu } from "antd";
import type { ReactNode } from "react";

export interface BtnValueProps {
  key: string;
  text: string;
  isShow: boolean;
  component?: ReactNode;
}

export type BtnsObjProps = Record<string, BtnValueProps>;

export interface ListActionBtnsRenderProps{
  btns: BtnsObjProps;
  menuClick: (key: string) => void;
  maxShowBtnsNum?: number; // 最多展示的按钮数量，超出则在dropdown中展示
}

const ListActionBtnsRender: React.FC<ListActionBtnsRenderProps> = (props) => {
  const { btns, menuClick, maxShowBtnsNum = 3 } = props
  const btnsRender = () => {
    const currentShowBtnKeys = Object.keys(btns)?.filter(k => btns[k]?.isShow);
    const currentShowBtns: BtnValueProps[] = []
    currentShowBtnKeys?.forEach(k => {
      if(btns[k]) {
        currentShowBtns.push(btns[k])
      }
    })
    if(currentShowBtns?.length < 1) {
      return null;
    } 
      // 小于等于maxShowBtnsNum个操作项时直接展示全部
      const showBtnsNum = currentShowBtns?.length > maxShowBtnsNum ? (maxShowBtnsNum - 1) : maxShowBtnsNum;
      const firstBtns = currentShowBtns?.filter((b, index) => index <= (showBtnsNum - 1));
      const restBtns = currentShowBtns?.filter((b, index) => index > (showBtnsNum - 1));
      return (
        <>
          {firstBtns?.map((f, index) => (
            <span key={f?.key}>
              {f?.component ? f?.component : (
                <a  onClick={() => menuClick(f?.key)}>{f?.text}</a>
              )}
            {index < firstBtns?.length - 1 && (
              <Divider type="vertical" />
            )}
          </span>
        ))}
        {restBtns?.length > 0 && (
          <>
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => menuClick(key)}>
                  {restBtns?.map(r => (
                    <Menu.Item key={r?.key}>{r?.text}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </>
        )}
      </>
    )
  }
  return (
    <>
      {btnsRender()}
    </>
  );
};

export default ListActionBtnsRender;