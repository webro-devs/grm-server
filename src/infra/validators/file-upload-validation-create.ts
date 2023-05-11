import { ParseFilePipeBuilder } from '@nestjs/common';

const FileUploadValidationForCreate = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|gif|mp4|pdf|doc|xlsx)$/,
  })
  .addMaxSizeValidator({
    maxSize: 5 * 1024 * 1024,
  })
  .build({
    fileIsRequired: true,
  });

export default FileUploadValidationForCreate;
