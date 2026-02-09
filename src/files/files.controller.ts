import {
  Controller, Post, UploadedFile,
  UseInterceptors, BadRequestException,
  Get,
  Param,
  Res,
  StreamableFile
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { lookup } from 'mime-types';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  /*
    In this example we are using Res decoratos to handle the response manually.
  */
  @Get('product/:imageName')
  getProductImageManualRes(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Get('productImage/:imageName')
  getProductImage(
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    const file = createReadStream(path);
    const mimeType = lookup(path) || 'application/octet-stream';

    return new StreamableFile(file, {
      type: mimeType,
    });
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file)
      throw new BadRequestException('Make sure to upload a valid file');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }
}
