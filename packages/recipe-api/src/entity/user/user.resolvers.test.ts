import { AppDataSource } from '../../../db/config/data-source.js';
import { graphQLServer } from '../../test/server.js';
import { expect } from 'chai';
import { User } from './User.js';
import bcrypt from 'bcrypt';

const mockUser: Pick<User, 'username' | 'email' | 'password'> = {
  username: 'toni',
  email: 'tm@gm.commm',
  password: '1234',
};

const hashedPassword = await bcrypt.hash(mockUser.password, 12);

const userRepository = AppDataSource.manager.getRepository(User);

describe('User', () => {
  beforeEach(async () => {
    await userRepository.delete({ email: mockUser.email });
  });

  it('should add user to DB', async () => {
    const body = {
      query: `#graphql
      mutation RegisterUser($registerInput: RegisterUserInput!) {
          registerUser(registerInput: $registerInput) {
              user {
                  username
                  email
              }
          }
      }
      `,
      variables: { registerInput: { ...mockUser } },
    };
    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.registerUser?.user).to.deep.equal({
      username: mockUser.username,
      email: mockUser.email,
    });
  });

  it('should login user if provided email and password are correct', async () => {
    const newUser = userRepository.create({ ...mockUser, password: hashedPassword });
    await userRepository.save(newUser);

    const body = {
      query: `#graphql
      mutation LoginUser($loginInput: LoginUserInput!) {
          loginUser(loginInput: $loginInput) {
              user {
                  username
                  email
              }
          }
      }
      `,
      variables: { loginInput: { email: mockUser.email, password: mockUser.password } },
    };
    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.loginUser?.user).to.deep.equal({
      username: mockUser.username,
      email: mockUser.email,
    });
  });

  it('shouldn`t login user if provided email and password are incorrect', async () => {
    const newUser = userRepository.create(mockUser);
    await userRepository.save(newUser);

    const body = {
      query: `#graphql
      mutation LoginUser($loginInput: LoginUserInput!) {
          loginUser(loginInput: $loginInput) {
              success
          }
      }
      `,
      variables: { loginInput: { email: mockUser.email, password: 'sddfsdfsfe' } },
    };
    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.loginUser?.success).to.be.false;
  });

  it('should return list of users', async () => {
    const body = {
      query: `#graphql
        query {
            users {
                email
            }
        }
      `,
    };

    const newUser = userRepository.create(mockUser);
    await userRepository.save(newUser);

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.users).to.be.an('array').that.deep.includes({ email: newUser.email });
  });

  it('should return user with specified ID', async () => {
    const newUser = userRepository.create(mockUser);
    await userRepository.save(newUser);

    const body = {
      query: `#graphql
        query GetUser($id: ID!) {
            user(id: $id) {
                email
            }
        }
      `,
      variables: { id: newUser.id },
    };

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.user?.email).to.equal(mockUser.email);
  });

  it('should update user with specified ID', async () => {
    const newUser = userRepository.create(mockUser);
    const createdUser = await userRepository.save(newUser);

    const bio = 'testing bio';
    const avatar = 'testing image';
    const password = '12345';

    const body = {
      query: `#graphql
      mutation UpdateUser($userId: ID!, $updateFields: UpdateUserInput!) {
          updateUser(userId: $userId, updateFields: $updateFields) {
              user {
                bio
                avatar
                password
              }
          }
      }
      `,
      variables: { userId: createdUser.id, updateFields: { bio, avatar, password } },
    };

    const result = await graphQLServer().send(JSON.stringify(body));

    expect(result.body).to.haveOwnProperty('data');
    expect(result.body.data?.updateUser?.user?.bio).to.equal(bio);
    expect(result.body.data?.updateUser?.user?.avatar).to.equal(avatar);
    const passwordIsEqual = await bcrypt.compare(password, result.body.data?.updateUser?.user?.password);
    expect(passwordIsEqual).to.be.true;
  });
});
