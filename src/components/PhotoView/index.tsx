import React, { useState, useEffect } from 'react';
import { PhotoProvider, PhotoView  } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { getJKENV } from '@/utils/utils';
import defaultImg from '@/assets/default_image.jpg';
import styles from './index.less';

export interface PhotoViewerProps {
  option?: string; // 默认是single
  thumbnailUrl?: string; // 缩略图url
  url?: string; // 图片链接
  intro?: string | React.ReactNode; // 图片介绍内容
}

const PhotoViewer: React.FC<PhotoViewerProps> = props => {
  const { option = 'single', url, children, thumbnailUrl } = props;
  const urlHandle = (val?: string) => {
    if (!val) return defaultImg;
    return `${getJKENV('VIEW_IMG_HOST')}${val}`;
  };

  const thumbnailUrlHandle = (val?: string) => {
    if (val) {
      // 缩略图存在
      return `${getJKENV('VIEW_IMG_HOST')}${val}`;
    }
    if (url) {
      // 产品主图存在
      return `${getJKENV('VIEW_IMG_HOST')}${url}`;
    }
    return defaultImg;
  };

  const [src, setSrc] = useState<string>(urlHandle(url));
  const [imgUrl, setImgSrc] = useState<string>(thumbnailUrlHandle(thumbnailUrl));

  useEffect(() => {
    const urlVal = urlHandle(url);
    setSrc(urlVal);
  }, [url]);

  useEffect(() => {
    setImgSrc(thumbnailUrlHandle(thumbnailUrl));
  }, [thumbnailUrl]);

  const handleError = () => {
    if (imgUrl === `${getJKENV('VIEW_IMG_HOST')}${thumbnailUrl}`) {
      // 错误的时候，如果当前图是缩略图，则换成主图看看
      setImgSrc(src);
      return;
    }
    // 其它情况下，当图片加载失败，采用默认图片
    setImgSrc(defaultImg);
  };

  // 预览图片加载失败
  const brokenElement: any = (
    <div>
      <img src={defaultImg} alt="" />
    </div>
  );

  return (
    <div>
      {option === 'single' && (
        <PhotoProvider maskClassName={styles.maskClassName} brokenElement={brokenElement}>
          <PhotoView src={src}>
            {children ? (
              <span>{children}</span>
            ) : (
              <img className={styles.productImg} src={imgUrl} onError={handleError} alt="" />
            )}
          </PhotoView>
        </PhotoProvider>
      )}
    </div>
  );
};

export default PhotoViewer;
