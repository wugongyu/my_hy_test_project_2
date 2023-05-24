import type { MenuDataItem} from '@ant-design/pro-layout';
import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import React from 'react';
import type { ConnectProps} from 'umi';
import { connect, useIntl } from 'umi';
import { Carousel, Avatar } from 'antd';
import type { ConnectState } from '@/models/connect';
import { motto, copyright } from '@/config/app';
import logo from '@/assets/logo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: Record<string, MenuDataItem>;
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();

  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <Carousel
        effect="fade"
        dots={false}
        autoplay
        easing="linear"
        speed={4000}
        // autoplayInterval={6000}
      >
        {motto.map(item => (
          <div key={item.id}>
            <div className={styles.sliderbg} style={{ backgroundImage: `url(${item.img})` }}>
              <div className={styles.mottoContent}>
                {item.motto.split('，').map(mottoItem => (
                  <div key={mottoItem} className={styles.motto}>
                    {mottoItem}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <div className={styles.container}>
        <div className={styles.conName}>
          <Avatar src={logo} />
          <span className={styles.conTitle}>客户管理系统</span>
        </div>
        <div className={styles.content}>{children}</div>
        <DefaultFooter links={false} copyright={copyright} />
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
