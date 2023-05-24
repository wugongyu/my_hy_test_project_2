import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import type { PhotoViewSliderProps } from '@/components/PhotoView/PhotoViewSlider';
import PhotoViewSlider from '@/components/PhotoView/PhotoViewSlider';
import { defaultUploadAction } from '@/config/app';
import styles from './index.less';
import { getTokenStorage } from '@/utils/handleLoginInfo';
import { isImageUrlFnc } from '@/utils/utils';
// import { getTokenStorage, isImageUrlFnc } from '@/utils/utilTools';

export interface PurUploadProps {
  value?: UploadFile<any>[]; // 显示的图片列表
  onChange?: (fileList: UploadFile<any>[]) => void; // 图片改变
  uploadButton?: React.ReactNode; // 上传按钮
  maxLength?: number; // 允许上传最大图片张数
  readonly?: boolean; // 只读状态，没有上传按钮
  maxSize?: number; // 支持上传的图片大小（单位m, 默认值5）
  uploadAction?: string; // 上传的接口
  multiple?: boolean; // 是否支持一次上传多张图片
  acceptStyle?: string; // 接受上传的文件类型
  acceptFileType?: string[]; // 可接受的文件类型
  headers?: any; // 上传时请求头部的设置
  isGetTypeByName?: boolean; // 是否通过附件名称后缀来判断附件类型，默认false，即默认是通过url的后缀来判断附件的类型的
}

const PurUpload: React.FC<PurUploadProps> = (props) => {
  const {
    value,
    onChange,
    uploadButton,
    maxLength = 100,
    readonly,
    maxSize = 5,
    uploadAction,
    multiple = false,
    acceptStyle = '.gif, .jpg, .jpeg, .png', // 默认接受的文件类型为图片
    acceptFileType = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'], // 默认--图片类型
    headers = {
      Authorization: `Bearer ${getTokenStorage()}`,
    },
    isGetTypeByName = false,
  } = props;

  const [fileList, setFileList] = useState<UploadFile<any>[]>(value || []);
  // const [urlArr, setUrlArr] = useState<string[]>([]);
  const [viewProps, setViewProps] = useState<PhotoViewSliderProps>({
    images: [],
    currentIndex: 0,
    visible: false,
  });

  useEffect(() => {
    if (value) {
      setFileList([...value]);
    }
  }, [value]);

  const handlePreview = async (file: any) => {
    const isImageUrl = file.url || file.response?.url || file.thumbUrl || '';
    const judgeVal = isGetTypeByName && file.name ? file.name : isImageUrl; // 判断附件类型的依据
    if (!isImageUrlFnc(judgeVal)) {
      // 非图片的链接，预览打开一个新标签页
      window.open(isImageUrl);
      return;
    }
    const fliterFileList = fileList.filter((item) => {
      const crrentImg = item.response?.url || item.url || item.thumbUrl || '';
      const currentJudgeVal = isGetTypeByName && item.name ? item.name : crrentImg; // 判断附件类型的依据
      return isImageUrlFnc(currentJudgeVal);
    });
    const currentIndex = fliterFileList.findIndex((item) => item.uid === file.uid);
    const images = [...fliterFileList].map((item) => {
      let url = '';
      if (item.response) {
        url = item.response?.url || '';
      }
      return url || item.url || item.thumbUrl || '';
    });
    setViewProps({
      images,
      currentIndex: currentIndex !== -1 ? currentIndex : 0,
      visible: true,
    });
  };

  const handleClosePreview = () => {
    setViewProps({
      ...viewProps,
      currentIndex: 0,
      visible: false,
    });
  };

  const handleChange = ({
    fileList: files,
    file,
  }: {
    fileList: UploadFile<any>[];
    file: UploadFile<any>;
  }) => {
    switch (file.status) {
      case 'error':
        message.error('上传错误');
        break;
      case 'done':
        if (!file?.response?.url) {
          // 上传接口报错
          message.error('上传失败');
          const findIndex = files.findIndex((item) => item.uid === file.uid);
          const cur: UploadFile<any> = {
            ...files[findIndex],
            status: 'error',
            error: { statusText: file?.response?.message || '上传错误' },
          };
          files.splice(findIndex, 1, { ...cur });
        } else {
          message.success('上传成功');
        }
        break;
      default:
        // 停止上传的情况
        if (file?.size && file?.size / 1024 / 1024 > maxSize) {
          message.error(`上传失败：文件大小不能超过${maxSize}M`);
          const findIndex = files.findIndex((item) => item.uid === file.uid);
          const cur: UploadFile<any> = {
            ...files[findIndex],
            status: 'error',
            error: { statusText: `文件大小不能超过${maxSize}M` },
          };
          files.splice(findIndex, 1, { ...cur });
        }
        break;
    }
    const isImageType = file?.type?.indexOf('image/') === 0;
    if (file?.status === 'done' && !isImageType) {
      const findIndex = files.findIndex((item) => item.uid === file.uid);
      const cur: UploadFile<any> = {
        ...files[findIndex],
        url: file?.response?.url || '',
      };
      files.splice(findIndex, 1, { ...cur });
    }
    if (onChange) {
      onChange([...files]);
    }
    setFileList([...files]);
  };

  const uploadButtonDefault = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">
        上传
        {multiple ? (
          <span style={{ display: 'inline-block', fontSize: 12 }}>(按住Ctrl可多选)</span>
        ) : null}
      </div>
    </div>
  );

  const handleBeforeUpload = (file: UploadFile<any>) => {
    if (file?.size && file?.size / 1024 / 1024 > maxSize) {
      message.error(`上传失败：文件大小不能超过${maxSize}M`);
      // 超过规定的maxSize的大小，停止接口的上传
      return false || Upload.LIST_IGNORE;
    }
    if (!(file.type && acceptFileType.includes(file.type))) {
      message.error(`上传失败：上传的文件类型不符合要求`);
      return false || Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div className={styles.PurUpload}>
      <Upload
        accept={acceptStyle}
        headers={headers}
        multiple={multiple}
        disabled={readonly}
        action={uploadAction || defaultUploadAction}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
      >
        {fileList.length >= maxLength || readonly ? null : uploadButton || uploadButtonDefault}
      </Upload>
      <PhotoViewSlider {...viewProps} onClose={handleClosePreview} />
    </div>
  );
};

export default PurUpload;
