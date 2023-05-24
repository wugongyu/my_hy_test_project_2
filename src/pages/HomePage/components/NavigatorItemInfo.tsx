import React from 'react';
import { Card } from 'antd';
import {
  AppstoreTwoTone,
  NotificationTwoTone,
  ContainerTwoTone,
  ToolTwoTone,
} from '@ant-design/icons';
import type { Dispatch } from 'umi';
import { Link, connect } from 'umi';
import type { NavigationProps } from '@/models/usermenu';
import styles from '../index.less';

export interface NavigatorItemInfoProps {
  navigationMap: NavigationProps[]; // 导航目录信息
  dispatch: Dispatch;
}

const iconStyle = {
  fontSize: 20,
};

const icons = {
  AppstoreTwoTone: <AppstoreTwoTone style={{ ...iconStyle }} />,
  NotificationTwoTone: <NotificationTwoTone style={{ ...iconStyle }} />,
  ContainerTwoTone: <ContainerTwoTone style={{ ...iconStyle }} />,
  ToolTwoTone: <ToolTwoTone style={{ ...iconStyle }} />,
};

const NavigatorItemInfo: React.FC<NavigatorItemInfoProps> = props => {
  const { navigationMap } = props;

  // 新打开一个标签页
  const linkToBlankPage = (href?: string) => {
    if(href) {
      window.open(href);
    }
  };

  // 处理各个card中的描述语句
  const handleCardDescription = (item: NavigationProps) => {
    let descriptionItem: React.ReactNode = null;
    descriptionItem = <div>{item?.description}</div>;
    return descriptionItem;
  };

  return (
    <>
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="功能导航"
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        {navigationMap.map(item => (
          <Card.Grid
            hoverable={!!item.href || !!item.blankHref}
            className={styles.projectGrid}
            style={item.href ? { cursor: 'pointer' } : {}}
            key={item.key || item.href || new Date().getTime()}
          >
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
            >
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    {icons[item.icon]}
                    {item.href ? (
                      <Link to={item.href}>{item.title}</Link>
                    ) : (
                      <a onClick={() => linkToBlankPage(item?.blankHref)}>{item.title}</a>
                    )}
                  </div>
                }
                description={handleCardDescription(item)}
              />
            </Card>
          </Card.Grid>
        ))}
      </Card>
    </>
  );
};

export default connect()(NavigatorItemInfo);
