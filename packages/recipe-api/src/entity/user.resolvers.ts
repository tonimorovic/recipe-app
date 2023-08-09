import { User } from './User.js';
import { AppDataSource } from '../../db/config/data-source.js';

const userRepository = AppDataSource.getRepository(User);

const userResolver = {
  Query: {
    async users() {
      const users = await userRepository.find();
      return users;
    },
  },
};

export default userResolver;
