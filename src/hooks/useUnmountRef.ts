import { useEffect, useRef } from 'react';

const useUnmountRef = () => {
  const unmountRef = useRef(false);

  useEffect(
    () =>
      // 组件卸载前执行的清除函数
      // 为防止内存泄漏，清除函数会在组件卸载前执行
      () => {
        // 组件卸载---将current变为true
        unmountRef.current = true;
      },
    [],
  );
  return unmountRef;
};

export default useUnmountRef;
