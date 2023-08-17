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

        return { success: true, message: `Fetched ${user.username}'s recipes`, recipes: userRecipes };
      } catch (error) {
        console.error(error);
      }
    },
  },
  Query: {
    async getUsers() {
      const users = await userRepository.find();
      return { success: true, message: 'Fetched all users', users };
    },
  },
  Mutation: {
    async createUser(_root: undefined, { user }: { user: User }) {
      const { username, email, password } = user;

      const userExists = await userRepository.findOneBy({ email });
      if (userExists) return { success: false, message: 'User already exists' };

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = userRepository.create({ username, email, password: hashedPassword });
      await userRepository.save(newUser);

      return { success: true, message: 'New user created', user: { username: newUser.username, email: newUser.email } };
    },
  },
};

export default userResolver;
