import { User, RoleType } from '@prisma/client'
import httpStatus from 'http-status'
import prisma from '../client'
import ApiError from '../utils/api-error'
import { encryptPassword } from '../utils/encryption'
import exclude from '../utils/exclude'

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  username: string,
  first_name: string,
  role: RoleType,
  last_name?: string
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  if (await getUserByUsername(username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken')
  }
  const data: {
    email: string
    username: string
    password: string
    first_name: string
    role: RoleType
    last_name?: string
  } = {
    email,
    username,
    password: await encryptPassword(password),
    first_name,
    last_name,
    role
  }
  return await prisma.user.create({
    data
  })
}

/**
 * Create a google user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createProviderUser = async (
  email: string,
  username: string,
  first_name: string,
  last_name?: string,
  profileImage?: string
): Promise<User> => {
  if (await getUserByUsername(username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken')
  }
  const data: {
    email: string
    username: string
    profileImage?: string
    first_name: string
    last_name?: string
  } = {
    email,
    username,
    profileImage,
    first_name,
    last_name
  }

  return await prisma.user.create({
    data
  })
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number
    page?: number
    sortBy?: string
    sortType?: 'asc' | 'desc'
  },
  keys: Key[] = ['id', 'email', 'username', 'password', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1
  const limit = options.limit ?? 10
  const sortBy = options.sortBy
  const sortType = options.sortType ?? 'desc'
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  })
  return users as Pick<User, Key>[]
}

const getAllUsers = async (search: string, parsedLimit: number, parsedPage: number) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        profileImage: true
      },
      where: {
        OR: [{ username: { contains: search, mode: 'insensitive' } }]
      },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit
    })
    return users
  } catch (err) {
    throw new ApiError(500, 'Internal Server Error')
  }
}

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: string,
  keys: Key[] = [
    'id',
    'email',
    'username',
    'password',
    'createdAt',
    'updatedAt',
    'profileImage'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>
}

/**
 * Get user
 * @param {ObjectId} id
 * @returns {User}
 */
const getUser = async (id: string): Promise<User> => {
  return prisma.user.findUnique({
    where: { id }
  }) as Promise<User>
}

/**
 * Get user by username
 * @param {string} username
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByUsername = async <Key extends keyof User>(
  username: string,
  keys: Key[] = ['id', 'email', 'username', 'password', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { username },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>
}

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = ['id', 'email', 'username', 'password', 'createdAt', 'updatedAt', 'role'] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: object): Promise<object> => {
  const user = await getUserById(userId, ['id', 'email', 'username'])
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody
  })
  return exclude(updatedUser, ['password', 'createdAt', 'updatedAt'])
}

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await prisma.user.delete({ where: { id: user.id } })
  return user
}

/**
 * Get custom userDetails by userId
 * @param {ObjectId} userId
 * @returns {Promise<object>}
 */
const getCustomDetails = async (userId: string): Promise<object | null> => {
  const userDetails = prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      username: true,
      createdAt: true
    }
  })
  return userDetails
}

/**
 * Get all artists
 * @returns {Promise<object>}
 */
const getAllArtists = async (): Promise<object[]> => {
  const userDetails = await prisma.user.findMany({
    where: {
      role: RoleType.ARTIST
    },
    include: {
      Package: {
        select: {
          id: true,
          totalRevisions: true,
          totalDays: true,
          actualname: true,
          price: true,
          name: true,
          description: true
        }
      }
    }
  })
  const userDetail = (userDetails ?? []).map((item) => {
    return exclude(item, ['password', 'createdAt', 'updatedAt'])
  })
  return userDetail
}
/**
 * Get all clients
 * @returns {Promise<object>}
 */
const getAllClients = async (): Promise<object[]> => {
  const userDetails = await prisma.user.findMany({
    where: {
      role: RoleType.CLIENT
    }
  })
  const userDetail = (userDetails ?? []).map((item) => {
    return exclude(item, ['password', 'createdAt', 'updatedAt'])
  })
  return userDetail
}
/**
 * Get all admins
 * @returns {Promise<object>}
 */
const getAllAdmins = async (): Promise<object[]> => {
  const userDetails = await prisma.user.findMany({
    where: {
      role: RoleType.ADMIN
    }
  })
  const userDetail = (userDetails ?? []).map((item) => {
    return exclude(item, ['password', 'createdAt', 'updatedAt'])
  })
  return userDetail
}
/**
 * Get user by id
 * @returns {Promise<object>}
 */
const getUserByuserId = async (userId: string): Promise<object> => {
  const userDetails = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      Package: {
        select: {
          id: true,
          totalRevisions: true,
          totalDays: true,
          actualname: true,
          price: true,
          name: true,
          description: true
        }
      }
    }
  })
  if (userDetails) {
    const userDetail = exclude(userDetails, ['password', 'createdAt', 'updatedAt'])
    return userDetail
  }
  return {}
}
/**
 * Change user role
 * @returns {Promise<void>}
 */
const changeUserRole = async (userId: string): Promise<void> => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await prisma.user.update({ where: { id: user.id }, data: { role: RoleType.ADMIN } })
}

export default {
  createUser,
  createProviderUser,
  getUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  deleteUserById,
  getCustomDetails,
  getAllUsers,
  getAllArtists,
  getAllClients,
  getAllAdmins,
  getUserByuserId,
  changeUserRole
}
