import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../../services/user.service';
import { SafeUser, User, UserCredentials } from '../../types/user';
import { user, safeUser } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');

      const savedUser = (await saveUser(user)) as SafeUser;

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toEqual(user.dateJoined);
    });
  });
});

describe('getUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the matching user', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const retrievedUser = (await getUserByUsername(user.username)) as SafeUser;

    expect(retrievedUser.username).toEqual(user.username);
    expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error when user is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const result = await getUserByUsername('nonexistent');

    expect(result).toEqual({ error: 'User not found' });
  });

  it('should return error when database operation fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');

    const result = await getUserByUsername(user.username);

    expect(result).toEqual({ error: 'Error when fetching user' });
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the user if authentication succeeds', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const loggedInUser = (await loginUser(credentials)) as SafeUser;

    expect(loggedInUser.username).toEqual(user.username);
    expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error for invalid credentials', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials: UserCredentials = {
      username: 'wrong',
      password: 'wrong',
    };

    const result = await loginUser(credentials);

    expect(result).toEqual({ error: 'Invalid username or password' });
  });

  it('should fail when password is incorrect', async () => {
    // Mock finding the user successfully
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials = {
      username: user.username,
      password: 'wrongPassword',
    };

    const result = await loginUser(credentials);

    expect(result).toEqual({ error: 'Invalid username or password' });
  });

  it('should return error when database operation fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const result = await loginUser(credentials);

    expect(result).toEqual({ error: 'Error during login' });
  });
});

describe('deleteUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the deleted user when deleted succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

    const deletedUser = (await deleteUserByUsername(user.username)) as SafeUser;

    expect(deletedUser.username).toEqual(user.username);
    expect(deletedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error when user is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndDelete');

    const result = await deleteUserByUsername('nonexistent');

    expect(result).toEqual({ error: 'User not found' });
  });

  it('should return error when database operation fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndDelete');

    const result = await deleteUserByUsername(user.username);

    expect(result).toEqual({ error: 'Error when deleting user' });
  });
});

describe('updateUser', () => {
  const updatedUser: User = {
    ...user,
    password: 'newPassword',
  };

  const safeUpdatedUser: SafeUser = {
    username: user.username,
    dateJoined: user.dateJoined,
  };

  const updates: Partial<User> = {
    password: 'newPassword',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the updated user when updated succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

    const result = (await updateUser(user.username, updates)) as SafeUser;

    expect(result.username).toEqual(user.username);
    expect(result.username).toEqual(updatedUser.username);
    expect(result.dateJoined).toEqual(user.dateJoined);
    expect(result.dateJoined).toEqual(updatedUser.dateJoined);
  });

  it('should return error when user is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const result = await updateUser('nonexistent', updates);

    expect(result).toEqual({ error: 'User not found' });
  });

  it('should return error when database operation fails', async () => {
    mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

    const result = await updateUser(user.username, updates);

    expect(result).toEqual({ error: 'Error when updating user' });
  });
});
