import { MediaTypes } from '@/constants/media-types';

export const checkMediaType = (args: any) => {
  const data = args.map((file: string) => {
    const fileParts = file.split('.');
    const fileExt = fileParts[fileParts.length - 1];
    if (MediaTypes.image.find((item) => item === fileExt))
      return {
        fileType: 'image',
        fileName: file,
      };

    if (MediaTypes.video.find((item) => item === fileExt))
      return {
        fileType: 'video',
        fileName: file,
      };
    return;
  });
  return data;
};
