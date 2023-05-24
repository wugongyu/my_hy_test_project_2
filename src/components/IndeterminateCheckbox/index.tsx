/**
 * 实现全选效果的复选框
 * */
 import { Checkbox } from "antd";
 import type { CheckboxChangeEvent } from "antd/lib/checkbox";
 import type { CheckboxOptionType, CheckboxValueType } from "antd/lib/checkbox/Group";
 import { useEffect, useState } from "react";
 
 interface IndeterminateCheckboxProps {
   value?: CheckboxValueType[];
   onChange?: (val: CheckboxValueType[]) => void;
   listOptions: CheckboxOptionType[];
   allSelectText?: string; // 全选文案
 }
 const CheckboxGroup = Checkbox.Group;
 const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = (props) => {
   const { value, onChange, listOptions, allSelectText = '全选' } = props;
   const [indeterminate, setIndeterminate] = useState<boolean>(true);
   const [checkAll, setCheckAll] = useState<boolean>(false);
   useEffect(() => {
    if(value) {
     setIndeterminate(!!value.length && value.length < listOptions.length);
     setCheckAll(value?.length === listOptions.length);
    } else {
      setIndeterminate(false);
      setCheckAll(false);
    }
   }, [value]);
   const onCheckAllChange = (e: CheckboxChangeEvent) => {
     if(onChange) {
       const allListVals = listOptions?.map(item => item.value);
       onChange(e.target.checked ? allListVals : []);
     }
     setIndeterminate(false);
     setCheckAll(e.target.checked);
   };
 
   const handleChange = (list: CheckboxValueType[]) => {
     if(onChange) {
       onChange(list);
     }
     setIndeterminate(!!list.length && list.length < listOptions.length);
     setCheckAll(list.length === listOptions.length);
   };
   return (
     <>
       <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
         {allSelectText}
       </Checkbox>
       <CheckboxGroup options={listOptions} value={value} onChange={handleChange} />
     </>
   );
 };
 
 export default IndeterminateCheckbox;