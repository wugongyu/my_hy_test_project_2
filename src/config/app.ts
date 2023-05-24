// 用户头像默认头像
export const defaultAvatar: string =
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

const packageJson = require('../../package.json');
// 版本内容
export const copyright = `2022 产品技术研发部出品  V${packageJson.version}`;

export const LOGIN_APP_ID = 151;

// 商品有效期天数范围
export const MIN_PRODUCT_MASS_DATE = 30;
export const MAX_PRODUCT_MASS_DATE = 180;

interface MottMoType {
  id: string;
  motto: string;
  img: null;
}

export const motto: MottMoType[] = [
  {
    id: '1',
    motto: '欢迎使用，客户管理系统',
    img: require('../assets/slider1.jpg'),
  },
  {
    id: '2',
    motto: '欢迎使用，客户管理系统',
    img: require('../assets/slider2.jpg'),
  },
  {
    id: '3',
    motto: '欢迎使用，客户管理系统',
    img: require('../assets/slider3.jpg'),
  },
  {
    id: '4',
    motto: '欢迎使用，客户管理系统',
    img: require('../assets/slider4.jpg'),
  },
];

// 手机格式校验
export const phoneCheck = {
  pattern: /^1[3-9]\d{9}$/,
  message: '手机格式错误',
};

// 数字的校验
export const numCheck = {
  pattern: /^\d+$/,
  message: '只能填入数字！',
};

// 邮箱的校验
export const emailCheck = {
  pattern: /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/,
  message: '请输入正确的邮箱账号',
}

// 字符串开头空格的校验
export const headSpaceCheck = {
  pattern: /^[^\s+]/,
  message: '请勿在开头输入空格',
}

export const allSpaceCheck = {
  pattern: /\s\S+|S+\s|\S/,
  message: '请勿输入纯空格',
}

// 上传接口
export const defaultUploadAction = '/api/erp/v1/files/upload';

export const uploadAcceptImageAndPdfStyle = '.jpg, .jpeg, .png, .PDF';
export const uploadAcceptImageFileType = ['image/jpg', 'image/jpeg', 'image/png'];
export const uploadAcceptPdfFileType = ['application/pdf'];

// 通用的表单布局
export const commonFormItemLayout = {
  xs: 12,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
  xxl: 6,
};
export const longFormItemWithouLabelLayout = {
  xs: 12,
  sm: 16,
  md: 16,
  lg: 16,
  xl: 16,
  xxl: 18,
};
// 通用的表单标签布局
export const commonFormItemLabelCol = { xxl: 6, xl: 6, md: 8, xs: 10 };
// 通用的表单控件布局
export const commonFormItemWrapperCol = { xxl: 16, xl: 16, md: 14, xs: 12 };

// des加密/解密的密码
export const desEncryKey = 'e7c2ac9d';

// 编辑客户联系人未解密手机号时的约定传参
export const mobilePhonePromiseKey = 'NOSIGN';
