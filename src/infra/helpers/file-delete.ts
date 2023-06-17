import { unlink } from 'fs';

const delte_file = (dirname: string): void => {
  unlink(dirname, (err) => {
    try {
      if (err) console.log(err);
      console.log(dirname, ' was deleted');
    } catch (err) {
      console.log(err);
    }
  });
};

export default delte_file;
