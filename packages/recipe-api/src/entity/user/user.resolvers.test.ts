import { AppDataSource } from '../../../db/config/data-source.js';
import { graphQLServer } from '../../test/server.js';
import { expect } from 'chai';
import { User } from './User.js';

const mockUser = {
  username: 'toni',
  email: 'tm@gm.commm',
  password: '1234',
};

const userRepository = AppDataSource.manager.getRepository(User);

describe('User', () => {
  beforeEach(async () => {
    await userRepository.delete({ email: mockUser.email });
  });

  it('should add user to DB', async () => {
    const body = {
      query: `#graphql
      mutation ($user: CreateUserInput!) {
          createUser(user: $user) {
              user {
                username
                email
              }
          }
      }
      `,
      variables: { user: mockUser },
    };
    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.createUser?.user).to.deep.equal({
      username: mockUser.username,
      email: mockUser.email,
    });
  });

  it('should return list of users', async () => {
    const body = {
      query: `#graphql
        query {
          getUsers {
            users {
                email
            }
          }
        }
      `,
    };

    const newUser = userRepository.create(mockUser);
    await userRepository.save(newUser);

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.getUsers?.users).to.be.an('array').that.deep.includes({ email: newUser.email });
  });
});
