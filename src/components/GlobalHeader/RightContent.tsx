import { Tag, Tooltip } from 'antd';
import type { ProSettings } from '@ant-design/pro-layout';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ConnectProps, Dispatch } from 'umi';
import { connect, useIntl } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import { helpWeb } from '@/config/common';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
  currentUser?: CurrentUser;
  dispatch: Dispatch;
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
  const { theme, layout } = props;
  let className = styles.right;
  const { formatMessage } = useIntl();

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a target="_blank" href={helpWeb} rel="noopener noreferrer" className={styles.action}>
          <QuestionCircleOutlined />
          </a>
        </Tooltip>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  currentUser: user.currentUser,
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
