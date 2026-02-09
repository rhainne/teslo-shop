import { BadRequestException } from "@nestjs/common";

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function
) => {
  if (!file)
    return callback(new Error('File is empty'), false);

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = file.mimetype.split('/')[1];

  if (!validExtensions.includes(fileExtension))
    return callback(new BadRequestException('Make sure to upload a valid image file (jpg,jpeg,png,gif)'), false);

  return callback(null, true);
}