import { useState, useCallback } from 'react';
/**
 * 自定义hook, 解决浏览器警告，组件卸载后不再进行状态更新
 * fix warning: Can't perform a React state update on an unmounted component.
 *  This is a no-op, but it indicates a memory leak in your application.
 *  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
 * */

const useSafeState = (unmountRef: { current: any }, defaultValue: any) => {
  // unmountRef是使用useRef生成的对象，其current属性值初始化为false,
  // 该对象在组件的整个生命周期内保持不变
  const [state, changeState] = useState(defaultValue);
  const wrapChangeState = useCallback(
    value => {
      if (!unmountRef.current) {
        // 仅在current为false时进行state的更新
        changeState(value);
      }
    },
    [changeState, unmountRef],
  );

  return [state, wrapChangeState];
};

export default useSafeState;
