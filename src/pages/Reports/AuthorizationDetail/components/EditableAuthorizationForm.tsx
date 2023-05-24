/**
 * 授权信息表单
 * */ 
import { Button, Col, Form, Row, Spin, message } from "antd";
import type { CheckboxOptionType } from "antd";
import { useEffect, useState } from "react";
import type { Dispatch } from "umi";
import { connect } from "umi";
import type { ConnectState } from "@/models/connect";
import IndeterminateCheckbox from "@/components/IndeterminateCheckbox";
import RoleBelonger from "@/components/RoleBelonger";
import type { MatchDataProps } from "@/services/data";
import type { DrugInfoItem } from "../../data";
import { createDataAuthorization, getAuthorizaitonInfo, getAuthorizedProductsInfo, modifyDataAuthorization } from "../../service";
import AuthorizedProductsTable from "./AuthorizedProductsTable";

interface EditableAuthorizationFormProps {
  match: MatchDataProps;
  dispatch: Dispatch;
  globalRootRegions: Record<string, string>;
}

const EditableAuthorizationForm: React.FC<EditableAuthorizationFormProps> = (props) => {
  const { match, dispatch, globalRootRegions } = props;
  const { params } = match;
  const [pageSpinning, setPageSpinning] = useState<boolean>(false);
  const [allAuthorizedProducts, setAllAuthorizedProducts] = useState<DrugInfoItem[]>([]);
  const [form] = Form.useForm();
  const [regionOptions, setRegionOptions] = useState<CheckboxOptionType[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const fetchOptions = async() => {
    setPageSpinning(true);
    const resData: CheckboxOptionType[] = [];
    Object.keys(globalRootRegions)?.forEach(k => {
      if(typeof Number(k) === 'number') {
        const areaObj = {
          value: k,
          label: globalRootRegions[k],
        };
        resData.push(areaObj);
      }
    })
    setRegionOptions(resData);
    setPageSpinning(false);
  }
  const fetchAuthorizedProducts = async(productIds: string) => {
    const res = await getAuthorizedProductsInfo(productIds);
    if(res && Array.isArray(res)) {
      const handledData = res?.map(item => ({
        ...item,
        productId: item.productCode, 
        manufacturerName: item.manufacturer,
        specification: item.packing,
      }))
      setAllAuthorizedProducts(handledData);
    }
  }
  const fetchAuthorizationInfo = async(id: string) => {
    setPageSpinning(true);
    const res = await getAuthorizaitonInfo(id);
    if(res?.authorizedUserId) {
      const { authorizedUserId = '', authorizedUserName = '', authorizedRegion = [], authorizedProduct = []  } = res || {};
      form?.setFieldsValue({
        authorizedUser: { value: authorizedUserId, label: authorizedUserName },
        authorizedRegion,
      });
      if(authorizedProduct?.length > 0) {
        await fetchAuthorizedProducts(authorizedProduct?.join(','));
      }
    }
    setPageSpinning(false);
  }
  useEffect(() => {
    fetchOptions();
  }, []);
  useEffect(() => {
    if(params.id) {
      fetchAuthorizationInfo(params.id);
    }
  }, [params]);
  const backToListPage = () => {
    const { id = '', uid = '' } = params || {};
    const currentPageRoute = id ? `/reports/authorization/edit/${id}/${uid}` : '/reports/authorization/add'
    // @ts-ignore
    Window.onskiproute(currentPageRoute, '/reports/dataAuthorization', true);
    // 更新列表
    dispatch({
      type: 'global/changeDataAuthorizationListRefreshFlag',
      payload: true,
    });
  }
  const handleSave = async() => {
    await form?.validateFields();
    if(allAuthorizedProducts?.length === 0) {
      message.error('请先添加授权商品再进行提交！');
      return;
    }
    setSubmitting(true);
    const formVals = form?.getFieldsValue();
    const { authorizedUser, ...rest } = formVals;
    let res = null;
    const currentParams = {
      ...rest,
      authorizedUserId: authorizedUser?.value || '',
      authorizedUserName: authorizedUser?.label || '',
      authorizedProduct: allAuthorizedProducts?.map(item => item.productId),
    }
    const handleTypeText = params.id ? '编辑' : '新增';
    if(params.id) {
      res = await modifyDataAuthorization(params.id, currentParams);
    } else {
      res = await createDataAuthorization(currentParams);
    }
    setSubmitting(false);
    if(res?.success) {
      message.success(`${handleTypeText}成功！`);
      backToListPage();
    } else {
      message.error(res?.message || `${handleTypeText}失败！`);
    }
  }
  return (
    <Spin spinning={pageSpinning}>
      <Form
        labelCol={{ span: 3}}
        wrapperCol={{ span: 21 }}
        layout="horizontal"
        form={form}
      >
        <Form.Item
          label="授权对象" 
          name="authorizedUser"
          rules={[{ required: true, message: '请选择授权对象' }]}
          extra="把相关销售数据和问诊数据授权给授权对象查看"
          wrapperCol={{ span: 8 }}
        >
          <RoleBelonger
            style={{ width: '100%' }}
            labelInValue
            placeholder="输入销售人员姓名查找"
            disabled={!!params.id}
          />
        </Form.Item>
        <Form.Item
          label='授权地区'
          name="authorizedRegion" 
          rules={[{ required: true, message: '请选择授权地区' }]}
          extra="授权数据涉及的业务发生区域。例如可善挺华南大区合作项目，按合同条款勾选【华南大区】涉及的省份即可。实际取数时，以业务实际发生的实体医院所在地为准。"
        >
          <IndeterminateCheckbox 
            listOptions={regionOptions}
            allSelectText="全国"
          />
        </Form.Item>
      </Form>
      <div>
        <Row>
          <Col span={3} className="ant-form-item-label">
            <label className="ant-form-item-required">授权商品</label>
          </Col>
          <Col span={21}>
            <AuthorizedProductsTable
              value={allAuthorizedProducts}
              onChange={setAllAuthorizedProducts}
              match={match}
              formProps={form}
            />
          </Col>
        </Row>
        <Button loading={submitting} style={{ marginTop: 10, marginLeft: '13%' }} type="primary" onClick={() => handleSave()}>保存</Button>
      </div>
    </Spin>
  );
};

export default connect(({ global }: ConnectState) => ({
  globalRootRegions: global.globalRootRegions || {},
}))(EditableAuthorizationForm);
