import { User } from './User.js';
import { AppDataSource } from '../../../db/config/data-source.js';
import { Recipe } from '../recipe/Recipe.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);
const recipeRepository = AppDataSource.getRepository(Recipe);
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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
      const user = await userRepository.findOneBy({ id });
      return user;
    },
  },
  Mutation: {
    async registerUser(
      _root: undefined,
      { registerInput }: { registerInput: Pick<User, 'username' | 'email' | 'password'> },
    ) {
      const { username, email, password } = registerInput;

      const userExists = await userRepository.findOneBy({ email });
      if (userExists) return { success: false, message: 'User already exists' };

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = userRepository.create({ username, email, password: hashedPassword });
      await userRepository.save(user);

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return { success: true, message: 'New user created', user, token };
    },
    async loginUser(_root: undefined, { loginInput }: { loginInput: Pick<User, 'email' | 'password'> }) {
      const { email, password } = loginInput;

      const user = await userRepository.findOneBy({ email });
      if (!user) return { success: false, message: 'Username or password invalid' };

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return { success: false, message: 'Username or password invalid' };

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return { success: true, message: 'Signed in user', user, token };
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
