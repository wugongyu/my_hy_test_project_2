import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const packageJson = require('../../package.json');

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="欢迎使用采购中心。"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 48,
        }}
      />
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        <SmileTwoTone /> 新采购中心 <HeartTwoTone twoToneColor="#eb2f96" /> V{packageJson.version}
      </Typography.Title>
    </Card>
    <p style={{ textAlign: 'center', marginTop: 24 }}>
      想要了解更多吗? 请前往{' '}
      <a href="/welcome" target="_blank" rel="noopener noreferrer">
        平台首页
      </a>
      。
    </p>
  </PageHeaderWrapper>
);