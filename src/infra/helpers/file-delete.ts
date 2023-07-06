import { unlink } from 'fs';

const deleteFile = (dirname: string): void => {
  if (dirname) {
    unlink(dirname, (err) => {
      if (err) console.log(err);
    });
  }
};

export default deleteFile;
