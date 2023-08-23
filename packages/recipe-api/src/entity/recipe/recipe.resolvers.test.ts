import { expect } from 'chai';
import { AppDataSource } from '../../../db/config/data-source.js';
import { graphQLServer } from '../../test/server.js';
import { Recipe } from './Recipe.js';
import { User } from '../user/User.js';

const recipeRepository = AppDataSource.manager.getRepository(Recipe);
const userRepository = AppDataSource.manager.getRepository(User);

const mockUser: User = {
  id: 1,
  username: 'test username',
  email: 'test email',
  password: 'test password',
  avatar: 'test avatar',
  bio: 'test bio',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRecipe: Pick<Recipe, 'title' | 'description' | 'ingredients' | 'instructions' | 'image' | 'price'> = {
  title: 'testing title',
  description: 'testing description',
  ingredients: JSON.stringify({ apple: 1 }),
  instructions: 'testing instructions',
  image: 'testing image',
  price: 32.99,
};

describe('Recipe', () => {
  before(async () => {
    await userRepository.save(mockUser);
  });

  after(async () => {
    await recipeRepository.delete({ title: mockRecipe.title });
    await userRepository.delete({ email: mockUser.email });
  });

  beforeEach(async () => {
    await recipeRepository.delete({ title: mockRecipe.title });
  });

  it('should add recipe to DB', async () => {
    const body = {
      query: `#graphql
      mutation CreateRecipe($userId: ID!, $recipe: CreateRecipeInput!) {
          createRecipe(userId: $userId, recipe: $recipe) {
              recipe {
                title
                price
              }
          }
      }
      `,
      variables: { userId: mockUser.id, recipe: mockRecipe },
    };
    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.createRecipe?.recipe).to.deep.equal({
      title: mockRecipe.title,
      price: mockRecipe.price,
    });
  });

  it('should return list of recipes', async () => {
    const body = {
      query: `#graphql
        query {
            recipes {
                title
            }
        }
      `,
    };

    const newRecipe = recipeRepository.create({ ...mockRecipe, user: mockUser });
    await recipeRepository.save(newRecipe);

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.recipes)
      .to.be.an('array')
      .that.deep.includes({ title: newRecipe.title });
  });

  it('should return recipe with specified ID', async () => {
    const newRecipe = recipeRepository.create({ ...mockRecipe, user: mockUser });
    await recipeRepository.save(newRecipe);

    const body = {
      query: `#graphql
        query GetRecipe($id: ID!) {
            recipe(id: $id) {
                title
            }
        }
      `,
      variables: { id: newRecipe.id },
    };

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.recipe?.title).to.equal(mockRecipe.title);
  });

  it('should update recipe with specified ID', async () => {
    const newRecipe = recipeRepository.create({ ...mockRecipe, user: mockUser });
    const createdRecipe = await recipeRepository.save(newRecipe);

    const title = 'testing title';
    const description = 'testing description';
    const ingredients = 'testing ingredients';
    const instructions = 'testing instructions';
    const image = 'testing image';
    const price = 22;

    const body = {
      query: `#graphql
      mutation UpdateRecipe($recipeId: ID!, $updateFields: UpdateRecipeInput!) {
          updateRecipe(recipeId: $recipeId, updateFields: $updateFields) {
              recipe {
                title
                description
                ingredients
                instructions
                image
                price
              }
          }
      }
      `,
      variables: {
        recipeId: createdRecipe.id,
        updateFields: { title, description, ingredients, instructions, image, price },
      },
    };

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.updateRecipe?.recipe).to.deep.equal({
      title,
      description,
      ingredients,
      instructions,
      image,
      price,
    });
  });
});
