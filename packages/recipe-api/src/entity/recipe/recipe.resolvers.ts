import { Recipe } from './Recipe.js';
import { AppDataSource } from '../../../db/config/data-source.js';

const recipeRepository = AppDataSource.getRepository(Recipe);

const recipeResolver = {
  Query: {
    async recipes() {
      const recipes = await recipeRepository.find();
      return recipes;
    },
  },
};

export default recipeResolver;
