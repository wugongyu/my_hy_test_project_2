import React from 'react';
import { debounce } from 'lodash';
import { FolderFilled, UserOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';
import { v4 } from 'uuid';
import { departmentsTreeType } from '@/config/dictionary';
import { getEmployeeInformation, searchDepartmentMembers } from '@/services/global';
import { defaultAvatar } from '@/config/app';
import Styles from './index.less';

interface RoleBelongerProps {
  value?: any;
  onChange?: (val?: any) => void;
  labelInValue?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

interface RoleBelongerState {
  treeData: any[];
  searchVal?: any;
  nameList: any[];
}

const { TreeNode } = TreeSelect;
class RoleBelonger extends React.Component<RoleBelongerProps, RoleBelongerState> {
  state: RoleBelongerState = {
    treeData: [],
    searchVal: null,
    nameList: [],
  };

  componentWillMount() {}

  componentDidMount() {
    this.getTreeData();
  }
  // 解决当在treeData中选中之后切换为输入关键词查询时，之前已选中的选项label会变为undefined问题
  /**
   * currentValue--当前已选中列表
   * selectedValue--之前已选中列表
   * */ 
  handleSelectedValue = (currentValue: any[], selectedValue: any[]) => {
    const handledData = currentValue?.map(item => {
      const findIndex = selectedValue?.findIndex(sItem => sItem.value === item.value);
      if(findIndex !== -1) {
        // 存在于已选列表中，替换掉当前选中列表的值
        return selectedValue[findIndex];
      }
      return item;
    });
    return handledData;
  }

  onTreeChange = (val: any) => {
    const { onChange, value, multiple, labelInValue } = this.props;
    const handeldValue = Array.isArray(val) && Array.isArray(value) ?  this.handleSelectedValue(val, value) : [];
    if(!onChange) return;
    if(multiple && labelInValue) {
      // 多选
      onChange(handeldValue);
    } else if(labelInValue && !multiple) {
      // 或单选且返回label值
      onChange(val);
    } else {
      // 单选且仅返回值
      onChange(val?.value)
    }
  };

  onSearch = debounce(async(val) => {
    const params = {
      pageSize: 20,
      current: 1, 
      nickName: val,
    };
    const response = await searchDepartmentMembers(params);
    if(response && (response?.data instanceof Array)) {
      this.setState({
        searchVal: val,
        nameList: response?.data || [],
      });
    }
  }, 500);

  getTreeData = async(id?: string, node?: { props: { value: any; }; } | undefined) => {
    const { treeData } = this.state;
    const response = await getEmployeeInformation({
      departmentId: id,
    });
    let handledData = [];
    if(response && response instanceof Array) {
      handledData = response?.map(item => ({
        ...item,
        uid: v4(),
      }))
    }
    if(node) {
      const nodeVal: any = node;
      nodeVal.props.dataRef.children = handledData || [];
      this.setState({
        treeData,
      });
    } else {
      this.setState({
        treeData: handledData,
      });
    }
  };

  loadData = (node: { props: { value: any; }; }) =>
    new Promise<void>(resolve => {
      // 异步数据
      this.getTreeData(node.props.value, node);

      resolve();
    });

  renderTreeNode = (data: any[] = []) =>
    data?.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            {...item}
            value={item.value}
            key={item.value}
            dataRef={item}
            title={item.name}
            selectable={false}
            icon={<FolderFilled style={{ color: '#3E9EFF' }} />}
          >
            {this.renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      /** type 1: 部门 2：成员  */
      return (
        <TreeNode
          {...item}
          value={item.value}
          key={item.value}
          dataRef={item}
          selectable={item.type === departmentsTreeType.MEMBER.id}
          isLeaf={item.type === departmentsTreeType.MEMBER.id}
          title={item.name}
          className={item.type === departmentsTreeType.MEMBER.id ? Styles.treeNodePeople : ''}
          icon={
            item.type !== departmentsTreeType.MEMBER.id ? (
              <FolderFilled style={{ color: '#3E9EFF' }} />
            ) : (
              <UserOutlined style={{ color: '#3E9EFF' }} />
            )
          }
        />
      );
    });

  renderPeopleNode = (nameList: any[] = []) =>
    nameList.map(item => (
      <TreeNode
        {...item}
        value={item.accountId}
        key={item.accountId}
        dataRef={item}
        isLeaf
        className="role-people-tree"
        title={item.nickName}
        icon={<img className="people-name-icon" src={`${item?.avatar || defaultAvatar}`} alt="" />}
      />
    ));

  filterTreeNode = () => {
    return true;
  };

  render() {
    const { value, disabled = false, multiple = false, ...rest } = this.props;
    const { treeData, searchVal, nameList } = this.state;
    return (
      <TreeSelect
        {...rest}
        showSearch
        treeIcon
        value={value}
        disabled={disabled}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        labelInValue
        onChange={this.onTreeChange}
        onSearch={this.onSearch}
        loadData={this.loadData}
        filterTreeNode={this.filterTreeNode}
        className="role-belonger"
        dropdownClassName="role-belonger-down"
        multiple={multiple}
      >
        {searchVal ? this.renderPeopleNode(nameList) : this.renderTreeNode(treeData)}
      </TreeSelect>
    );
  }
}

export default RoleBelonger;
