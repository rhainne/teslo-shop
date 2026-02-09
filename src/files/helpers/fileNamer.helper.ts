import { v4 as uuid } from 'uuid';
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function
) => {

  const fileExtension = file.originalname.split('.').pop();
  const fileHelper = file.originalname.split('.');
  const fileExt = fileHelper[fileHelper.length - 1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  return callback(null, `${uuid()}.${fileExtension}`);
}