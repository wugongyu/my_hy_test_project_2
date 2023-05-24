import type { CommonEnumsProps, EnumValue } from "@/services/data";


/**
 * 将Enums数组转为对象使用
 * @param totalEnums---所有枚举值数组
 * @param name---目标枚举数组名
 * @param valueAsKey---是否将枚举值作为对象的key使用(为true用作列表项的枚举值)
 * */

export function changeEnumsListToObj(params: {
  totalEnums?: CommonEnumsProps[],
  enumName: string,
  valueAsKey?: boolean,
}) {
  const { totalEnums, enumName, valueAsKey = false } = params;
  const enumObj: Record<string, any> = {};
  const findEnumsByName = Array.isArray(totalEnums) ? totalEnums?.find(
    (item: CommonEnumsProps) => item?.enumName?.toLowerCase() === enumName.toLowerCase(),
  ) : null;
  const currentEnumList = findEnumsByName && findEnumsByName?.enumValue ? findEnumsByName.enumValue : [];
  if (currentEnumList && currentEnumList?.length > 0) {
    currentEnumList.forEach((item: EnumValue) => {
      const { name, value, desc } = item;
      if (name && !valueAsKey) {
        enumObj[name] = {
          id: value,
          text: desc,
        };
      } else {
        enumObj[value] = {
          text: desc,
        };
      }
    });
  }
  return enumObj;
}