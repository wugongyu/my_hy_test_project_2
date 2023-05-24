/**
 * 地址
 * 中华人民共和国国家标准 GB/T 2260 行政区划代码
 * github：https://github.com/cn/GB2260.git
 * 版本：201607
 *
 */
import gb2260 from 'gb2260';

const revisions = gb2260.revisions();

// eslint-disable-next-line import/no-dynamic-require
gb2260.register(revisions[0], require(`gb2260/lib/${revisions[0]}`));

const gb = new gb2260.GB2260(revisions[0]);

const address = {
  get: code => {
    // 根据编号获取地址信息
    if (code && code.length === 6) {
      return gb.get(code);
    }
    console.error('address地址code不存在');
    return {};
  },
  // 获取所有省份级数据
  getProvinces: () => gb.provinces(),
  getPrefectures: code => {
    // 获取某个省份下的市级地址数据
    if (!code) {
      return [];
    }
    return gb.prefectures(code);
  },
  getCounties: code => {
    // 获取某个市级下的区级地址数据
    if (!code) {
      return [];
    }
    return gb.counties(code);
  },
  // 获取gb2260目前所有版本号
  getRevisions: () => gb2260.revisions(),
};

export default address;
