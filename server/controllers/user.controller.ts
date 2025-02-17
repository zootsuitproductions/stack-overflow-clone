import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== '' &&
    req.body.password !== undefined &&
    req.body.password !== '';

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const user: User = {
      username: req.body.username,
      password: req.body.password,
      dateJoined: new Date(),
    };

    const result = await saveUser(user);

    if ('error' in result) {
      res.status(500).send(result.error);
      return;
    }

    res.status(200).json(result);
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const userCredentials: UserCredentials = {
      username: req.body.username,
      password: req.body.password,
    };

    const result = await loginUser(userCredentials);

    if ('error' in result) {
      res.status(500).send(result.error);
      return;
    }

    res.status(200).json(result);
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    const { username } = req.params;

    const result = await getUserByUsername(username);

    if ('error' in result) {
      res.status(404).send(result.error);
      return;
    }

    res.status(200).json(result);
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    const result = await deleteUserByUsername(username);

    if ('error' in result) {
      res.status(500).send(result.error);
      return;
    }

    res.status(200).json(result);
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const { username, password } = req.body;
    const result = await updateUser(username, { password });

    if ('error' in result) {
      res.status(500).send(result.error);
      return;
    }

    res.status(200).json(result);
  };

  // Define routes for the user-related operations.
  router.get('/getUser/:username', getUser);
  router.patch('/resetPassword', resetPassword);
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.delete('/deleteUser/:username', deleteUser);

  return router;
};

export default userController;
