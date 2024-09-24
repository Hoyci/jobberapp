import { AuthModel } from '@auth/models/auth.schema';
import { loginSchema } from '@auth/schemes/signin';
import { getAuthUserByEmail, getAuthUserByUsername, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, isEmail } from '@hoyci/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

export async function read(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));

  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignIn read() method error');
  }

  const { username, password } = req.body;

  const isValidEmail: boolean = isEmail(username);
  const existingUser: IAuthDocument = !isValidEmail ? await getAuthUserByUsername(username) : await getAuthUserByEmail(username);

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }

  const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(password, existingUser.password!);

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }

  const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  const userData: IAuthDocument = omit(existingUser, ['password']);

  res.status(StatusCodes.OK).json({ message: 'User login successfully', user: userData, token: userJWT });
}
