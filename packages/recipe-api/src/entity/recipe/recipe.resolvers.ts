import { Recipe } from './Recipe.js';
import { AppDataSource } from '../../../db/config/data-source.js';
import { User } from '../user/User.js';

const recipeRepository = AppDataSource.getRepository(Recipe);
const userRepository = AppDataSource.getRepository(User);

const recipeResolver = {
  Query: {
    async recipes() {
      const recipes = await recipeRepository.find();
      return recipes;
    },
    async recipe(_root: undefined, { id }: { id: number }) {
      const recipe = await recipeRepository.findOneBy({ id });
      return recipe;
    },
  },
  Mutation: {
    async createRecipe(
      userId: number,
      {
        recipe,
      }: { recipe: Pick<Recipe, 'title' | 'description' | 'ingredients' | 'instructions' | 'image' | 'price'> },
    ) {
      const { title, description, ingredients, instructions, image, price } = recipe;

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) return { success: false, message: 'No provided user' };

      const newRecipe = recipeRepository.create({ title, description, ingredients, instructions, image, price, user });
      await recipeRepository.save(newRecipe);

      return { success: true, message: 'New recipe created', recipe };
    },
    async updateRecipe(
      _root: undefined,
      {
        recipeId,
        updateFields,
      }: {
        recipeId: number;
        updateFields: Pick<Recipe, 'title' | 'description' | 'ingredients' | 'instructions' | 'image' | 'price'>;
      },
    ) {
      const { title, image, price, instructions, ingredients, description } = updateFields;

      const recipe = await recipeRepository.findOneBy({ id: recipeId });
      if (!recipe) return { success: false, message: 'No specified recipe' };

      if(title) {
        recipe.title = title
      }
      
      if(image) {
        recipe.image = image
      }
      
      if(price) {
        recipe.price = price
      }
      
      if(instructions) {
        recipe.instructions = instructions
      }
      
      if(ingredients) {
        recipe.ingredients = ingredients
      }
      
      if(description) {
        recipe.description = description
      }

      recipeRepository.save(recipe);

      return { success: true, message: 'Recipe successfully updated', recipe };
    },
  },
};

export default recipeResolver;
