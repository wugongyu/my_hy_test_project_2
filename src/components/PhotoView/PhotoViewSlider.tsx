import React, { useState, useEffect } from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import styles from './index.less';

export interface PhotoViewSliderProps {
  images: string[]; // 预览图片的链接数组
  currentIndex?: number; // 预览当前图片的索引
  visible: boolean; // 预览控制值
  onClose?: () => void; // 关闭预览
  imgTitle?: string; // 图片标题
}

const PhotoViewSlider: React.FC<PhotoViewSliderProps> = props => {
  const { currentIndex = 0, images, visible, onClose } = props;

  const [photoIndex, setPhotoIndex] = useState(currentIndex);

  useEffect(() => {
    setPhotoIndex(currentIndex);
  }, [currentIndex]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div>
      <PhotoSlider
        maskClassName={styles.maskClassName}
        images={images.map(item => ({ src: item, key: item }))}
        visible={visible}
        onClose={handleClose}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </div>
  );
};

export default PhotoViewSlider;
