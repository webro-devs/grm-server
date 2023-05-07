import { User } from '../../user/user.entity';

interface ILogin {
  accessTokenCookie: string;
  refreshTokenCookie: string;
  user: User;
}

export default ILogin;
