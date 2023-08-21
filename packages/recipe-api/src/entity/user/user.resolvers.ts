import { User } from './User.js';
import { AppDataSource } from '../../../db/config/data-source.js';
import { Recipe } from '../recipe/Recipe.js';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);
const recipeRepository = AppDataSource.getRepository(Recipe);

const userResolver = {
  User: {
    async recipes(user: User) {
      try {
        const userRecipes = await recipeRepository.find({
          where: { user: { id: user.id } },
        });

        userRecipes.forEach((recipe) => (recipe.ingredients = JSON.stringify(recipe.ingredients)));

        return userRecipes;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Query: {
    async users() {
      const users = await userRepository.find();
      return users;
    },
    async user(_root: undefined, { id }: { id: number }) {
      const user = await userRepository.findOneBy({id});
      return user
    },
  },
  Mutation: {
    async createUser(_root: undefined, { user }: { user: Pick<User, 'username' | 'email' | 'password'> }) {
      const { username, email, password } = user;

      const userExists = await userRepository.findOneBy({ email });
      if (userExists) return { success: false, message: 'User already exists' };

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = userRepository.create({ username, email, password: hashedPassword });
      await userRepository.save(newUser);

      return { success: true, message: 'New user created', user: { username: newUser.username, email: newUser.email } };
    },
    // TODO: After implementing authentication check if authenticated user is the one that should be updated
    async updateUser(
      _root: undefined,
      { userId, updateFields }: { userId: number; updateFields: Pick<User, 'bio' | 'avatar' | 'password'> },
    ) {
      const { bio, avatar, password } = updateFields;

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) return { success: false, message: 'No specified user' };

      if (bio) {
        user.bio = bio;
      }

      if (avatar) {
        user.avatar = avatar;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
      }

      userRepository.save(user);

      return { success: true, message: 'User successfully updated', user };
    },
  },
};

export default userResolver;
