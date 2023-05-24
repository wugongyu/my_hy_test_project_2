import React from 'react';
import index from '@/assets/index_bg.png';
import motto from '@/assets/index_motto.png';
import styles from './index.less';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';

const HomePage: React.FC<{}> = () => {
  return (
    <>
      <div className={styles.imgWrap}>
        <div className={styles.indexmotto} style={{ backgroundImage: `url(${motto})` }} />
        <div className={styles.indexwrap} style={{ backgroundImage: `url(${index})` }} />
      </div>
    </>
  );
};

export default HomePage;
