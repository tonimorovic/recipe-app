import { User } from '../entity/user/User.js';
import { AppDataSource } from '../../db/config/data-source.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../entity/user/user.resolvers.js';
export const getUser = async (token: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { userId } = jwt.verify(token, JWT_SECRET);

  const user = await AppDataSource.manager.findOneBy(User, { id: userId });

  return user;
};
