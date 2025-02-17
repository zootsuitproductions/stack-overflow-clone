import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    const { password, ...safeUser } = result.toObject();
    return safeUser;
  } catch (error) {
    return { error: 'Error when saving a user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ username });

    if (!result) {
      return { error: 'User not found' };
    }

    const { password, ...safeUser } = result.toObject();
    return safeUser;
  } catch (error) {
    return { error: 'Error when fetching user' };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  try {
    // First find user by username and password together to ensure both match
    const user = await UserModel.findOne({
      username: loginCredentials.username,
      password: loginCredentials.password,
    });

    // If no user found with matching username and password
    if (!user) {
      return { error: 'Invalid username or password' };
    }

    // If we get here, both username and password matched
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  } catch (error) {
    return { error: 'Error during login' };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndDelete({ username });

    if (!result) {
      return { error: 'User not found' };
    }

    const { password, ...safeUser } = result.toObject();
    return safeUser;
  } catch (error) {
    return { error: 'Error when deleting user' };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate({ username }, updates, { new: true });

    if (!result) {
      return { error: 'User not found' };
    }

    const { password, ...safeUser } = result.toObject();
    return safeUser;
  } catch (error) {
    return { error: 'Error when updating user' };
  }
};
