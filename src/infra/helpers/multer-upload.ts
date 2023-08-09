import { diskStorage } from 'multer';

const multerStorage = (dest) =>
  diskStorage({
    destination: dest,
    filename: (req, file, cb) => {
      const randomName = `${new Date().getTime()}`;
      return cb(
        null,
        `${file.originalname.split('.')[0]}${randomName}.${
          file.originalname.split('.')[1]
        }`,
      );
    },
  });

export default multerStorage;
