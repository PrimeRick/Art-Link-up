import passport from 'passport'
import httpStatus from 'http-status'
import ApiError from '../utils/api-error'
import { NextFunction, Request, Response } from 'express'
import { User } from '@prisma/client'
import { roleRights } from '../config/roles'

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[],
    res: Response
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
    }
    res.locals.user = user

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role as string) ?? []
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      )
      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'))
      }
    }
    resolve()
  }

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights, res)
      )(req, res, next)
    })
      .then(() => next())
      .catch((err) => next(err))
  }

export default auth
