import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import styles from './index.less';
import address from '@/config/address';

const { Option } = Select;

const nullSlectItem = {
  label: '',
  key: '',
};

class GeographicView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      provinces: [],
      cities: [],
      counties: [],
    };
  }

  componentDidMount = () => {
    this.setState({
      provinces: address.getProvinces(),
    });
  };

  componentDidUpdate(props) {
    const { value } = this.props;

    if (!props.value && !!value && !!value.province) {
      this.getCityByProvince(value.province.key);
    }
  }

  getCityByProvince(provinceCode) {
    // 获取某个省份下所有市辖区
    this.setState({
      cities: address.getPrefectures(provinceCode),
    });
  }

  getCountyByCity(cityCode) {
    // 获取某个市辖区下的所有县级市
    this.setState({
      counties: address.getCounties(cityCode),
    });
  }

  getProvinceOption() {
    const { provinces } = this.state;
    return this.getOption(provinces);
  }

  getCityOption = () => {
    const { cities } = this.state;
    return this.getOption(cities);
  };

  getCountyOption = () => {
    const { counties } = this.state;
    return this.getOption(counties);
  };

  getOption = list => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map(item => (
      <Option key={item.code} value={item.code} title={item.name}>
        {item.name}
      </Option>
    ));
  };

  selectProvinceItem = item => {
    // this.getCityByProvince(item.key);
    const { onChange } = this.props;
    onChange({
      province: item,
      city: nullSlectItem,
      county: nullSlectItem,
    });
  };

  selectCityItem = item => {
    // this.getCountyByCity(item.key);
    const { value, onChange } = this.props;
    onChange({
      province: value.province,
      city: item,
      county: nullSlectItem,
    });
  };

  selectCountyItem = item => {
    const { value, onChange } = this.props;
    onChange({
      province: value.province,
      city: value.city,
      county: item,
    });
  };

  conversionObject() {
    const { value } = this.props;
    if (!value) {
      return {
        province: nullSlectItem,
        city: nullSlectItem,
        county: nullSlectItem,
        cities: [],
        counties: [],
      };
    }
    const { province, city, county } = value;
    const cities = province && province.key ? address.getPrefectures(province.key) : [];
    const counties = city && city.key ? address.getCounties(city.key) : [];
    return {
      province: province || nullSlectItem,
      city: city || nullSlectItem,
      county: county || nullSlectItem,
      cities,
      counties,
    };
  }

  render() {
    const { province, city, county, cities, counties } = this.conversionObject();
    const { isLoading } = this.state;
    const { selectStyle, isFullItem = false } = this.props;
    const currentStyleName = isFullItem  ? styles.fullItem : styles.item;
    return (
      <Spin spinning={isLoading} wrapperClassName={styles.row}>
        <Select
          className={currentStyleName}
          style={selectStyle}
          value={province}
          labelInValue
          showSearch
          filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) > -1}
          onSelect={this.selectProvinceItem}
        >
          {this.getProvinceOption()}
        </Select>
        <Select
          className={currentStyleName}
          style={selectStyle}
          value={city}
          labelInValue
          showSearch
          filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) > -1}
          onSelect={this.selectCityItem}
        >
          {this.getOption(cities)}
        </Select>
        <Select
          className={currentStyleName}
          style={selectStyle}
          value={county}
          labelInValue
          showSearch
          filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) > -1}
          onSelect={this.selectCountyItem}
        >
          {this.getOption(counties)}
        </Select>
      </Spin>
    );
  }
}

export default GeographicView;
