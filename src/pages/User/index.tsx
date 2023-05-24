import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Modal, message } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ConnectState } from '@/models/connect';
import type { StateType } from '@/models/login';
import styles from './index.less';
import { encryptByDES, encryptPassWordByMD5, getJKENV } from '@/utils/utils';
import { LOGIN_APP_ID } from '@/config/app';
import { getCaptchaByUsername } from '@/services/user';

const FormItem = Form.Item;

interface LoginProps {
  submitting?: boolean;
  ticketLoading?: boolean;
  dispatch: Dispatch;
  login: StateType;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    className={styles.alertContent}
    style={{
      marginTop: '12px',
    }}
    message={content}
    type="error"
    showIcon
  />
);

const { confirm } = Modal;

const countDown = 60

const Login: React.FC<LoginProps> = (props) => {
  const { submitting, dispatch, login = {}, ticketLoading } = props;
  const { status, message: errMsg } = login;
  const [form] = Form.useForm();
  const [captchaDisabled] = useState<boolean>(false)
  const [count, setCount] = useState<number>(countDown || 0);
  const [timing, setTiming] = useState(false);
  const [captchaBtnLoading, setCaptchaBtnLoading] = useState(false);
  const skipToOA = () => {
    const formVal = form.getFieldsValue();
    const currentInputUsername = formVal?.username || '';
    window.open(`${getJKENV('OA_FINDPWD_HOST')}${currentInputUsername.trim()}`);
  };
  useEffect(() => {
    setCaptchaBtnLoading(!!ticketLoading);
  }, [ticketLoading]);
  useEffect(() => {
    let interval: number = 0;
    if (timing) {
      interval = window.setInterval(() => {
        setCount(preSecond => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval);
            // 重置秒数
            return countDown || 60;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);
  /** 忘记账号密码，可跳转至OA处理 */
  const skipConfirm = () => {
    confirm({
      title: '忘记账号密码？请确认是否跳转OA进行处理?',
      icon: <ExclamationCircleOutlined />,
      okText: '立即跳转',
      cancelText: '取消',
      onOk() {
        skipToOA();
      },
    });
  };
  const handleSubmit = async (values: any) => {
    await form.validateFields();
    const { password, username, captcha } = values;
    // 密码使用md5加密(字符串+转小写)
    const pwd = encryptPassWordByMD5({ val: password });
    // 1、md5加密密码 2.将obj转为json字符串然后进行DES对称加密
    const obj = {
      username: username?.trim(),
      captcha,
      password: pwd,
      appId: LOGIN_APP_ID,
    };
    const userSecret = encryptByDES({ val: JSON.stringify(obj) });
    dispatch({
      type: 'login/login',
      payload: {
        userSecret,
      },
    });
  };
  const handleValuesChange = () => {
    // 当表单值发生改变后，将顶部错误提示清空
    dispatch({
      type: 'login/changeLoginStatus',
      payload: {
        status: 'ok',
        message: '',
      },
    });
  };
  const handleGetCaptchaRequest = async() => {
    const userName = form.getFieldValue('username')?.trim();
    setCaptchaBtnLoading(true);
    const res = await getCaptchaByUsername({ userName });
    if(res?.success) {
      setTiming(true);
      message.success('发送验证码成功！')
    } else {
      dispatch({
        type: 'login/changeLoginStatus',
        payload: {
          status: 'error',
          message: res?.message || '获取验证码失败',
        },
      });
    }
    setCaptchaBtnLoading(false);
   }
  const handleGetCaptcha = async() => {
    handleValuesChange();
    await form.validateFields(['username']);
    const ticketParams = {
      username: getJKENV('TICKET_USERNAME'),
      password: getJKENV('TICKET_PASSWORD'),
    }
    const userSecret = encryptByDES({val: JSON.stringify(ticketParams)});
    // 先获取ticket
    dispatch({
      type: 'login/fetchTicketBeforeCapcha',
      payload: {
        userSecret,
      },
      callback: () => handleGetCaptchaRequest(),
    });
  }
  return (
    <div className={styles.main}>
      <div className={styles.loginTitle}>账号密码登录</div>
      {status === 'error' && !submitting && <LoginMessage content={errMsg || ''} />}
      <Form
        form={form}
        className={styles.loginForm}
        onFinish={(values) => handleSubmit(values)}
        onValuesChange={handleValuesChange}
      >
        <FormItem name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
          <Input prefix={<UserOutlined />} placeholder="OA账号" />
        </FormItem>
        <FormItem
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="OA密码" />
        </FormItem>
        <div
          className={styles.captchaFormItem}
        >
          <FormItem
            className={styles.captchaInputItem}
            name="captcha"
            rules={[{ required: true, message: '请输入验证码！' }]}

          >
            <Input />
          </FormItem>
          <Button
            className={styles.captchaBtnItem}
            disabled={captchaDisabled || timing}
            onClick={() => {
              handleGetCaptcha()
            }}
            loading={captchaBtnLoading}
          >
            {timing
              ? `${count}秒`
              : '获取验证码'}
          </Button>
        </div>
        <FormItem
          style={{
            marginBottom: 12,
          }}
        >
          <Button
            loading={submitting}
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.loginButton}
          >
            登录
          </Button>
        </FormItem>
        <FormItem
          style={{
            textAlign: 'right',
            marginBottom: 12,
          }}
        >
          <a onClick={() => skipConfirm()} style={{ textDecoration: 'underline' }}>
            忘记密码？
          </a>
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  login,
  submitting: loading.effects['login/login'],
  ticketLoading: loading.effects['login/fetchTicketBeforeCapcha'],
}))(Login);
