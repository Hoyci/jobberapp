import { getAuthUserByUsername, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument } from '@hoyci/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function token(req: Request, res: Response): Promise<void> {
  const existingUser: IAuthDocument = await getAuthUserByUsername(req.params.username);

  if (!existingUser) {
    throw new BadRequestError('Username is invalid', 'RefreshToken token() method error');
  }

  const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);

  res.status(StatusCodes.OK).json({ message: 'Refresh token', user: existingUser, token: userJWT });
}
