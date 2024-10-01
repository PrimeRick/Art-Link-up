import { Package, PackageType, RoleType } from '@prisma/client'
import prisma from '../client'
import ApiError from '../utils/api-error'
import httpStatus from 'http-status'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Allow<T = any> = T | null

type PackageRet = Omit<Package, 'createdAt' | 'updatedAt' | 'artistId' | 'Commission'>

/**
 * Get All Packages
 * @returns {Promise<PackageRet[]>}
 */
const getAllPackages = async (): Promise<PackageRet[]> => {
  const packages = await prisma.package.findMany({
    select: {
      id: true,
      name: true,
      actualname: true,
      description: true,
      totalDays: true,
      price: true,
      totalRevisions: true,
      artist: {
        select: {
          id: true,
          username: true,
          profileImage: true
        }
      }
    }
  })
  return packages
}

/**
 * Get All Packages of a artist
 * @returns {Promise<PackageRet[]>}
 */
const getUserPackages = async (userId: string): Promise<PackageRet[]> => {
  const users = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.ARTIST
    },
    select: {
      Package: {
        select: {
          id: true,
          name: true,
          actualname: true,

          description: true,
          totalDays: true,
          price: true,
          totalRevisions: true,
          artist: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          }
        }
      }
    }
  })
  return users?.Package ?? []
}

interface packageBody {
  name: PackageType
  actualname: string
  description: string
  totalDays: number
  totalRevisions: number
  price: number
}
/**
 * Create user package
 * @param {ObjectId} userId
 * @param {object} packageBody
 * @returns {Promise<Package>}
 */
const createUserPackage = async (userId: string, packageBody: packageBody): Promise<Package> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.ARTIST
    }
  })
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Package creation not Allowed')
  }
  const existingPackage = await prisma.package.findFirst({
    where: {
      artistId: userId,
      name: packageBody.name
    }
  })
  if (existingPackage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Package for plan already exists.')
  }
  const createdPackage = await prisma.package.create({
    data: {
      artistId: userId,
      ...packageBody
    }
  })
  return createdPackage
}

/**
 * Delete user package
 * @param {ObjectId} userId
 * @returns {Promise<void>}
 */
const deleteUserPackages = async (userId: string): Promise<void> => {
  await prisma.package.deleteMany({
    where: {
      artistId: userId
    }
  })
}

/**
 * Get Package by id
 * @param {ObjectId} id
 * @returns {Promise<PackageRet>}
 */
const getPackageById = async (id: string): Promise<PackageRet | object> => {
  const singlepackage = await prisma.package.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      actualname: true,
      description: true,
      totalDays: true,
      price: true,
      totalRevisions: true,
      artist: {
        select: {
          id: true,
          username: true,
          profileImage: true
        }
      }
    }
  })
  return singlepackage ?? {}
}

/**
 * Create user package
 * @param {ObjectId} userId
 * @param {ObjectId} id
 * @param {object} updatePackageBody
 * @returns {Promise<Package>}
 */
const updatePackageById = async (
  userId: string,
  id: string,
  updatePackageBody: Allow
): Promise<Package> => {
  if (!(await prisma.package.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Package not found')
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.ARTIST
    }
  })
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Package updation not Allowed')
  }
  if (updatePackageBody?.actualname) {
    const existingPackage = await prisma.package.findFirst({
      where: {
        artistId: userId,
        actualname: updatePackageBody?.actualname as string
      }
    })
    if (existingPackage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Package for plan already exists.')
    }
  }
  const Package = await prisma.package.update({
    where: {
      id,
      artistId: userId
    },
    data: {
      ...updatePackageBody
    }
  })
  return Package
}

/**
 * delete user package
 * @param {ObjectId} userId
 * @param {ObjectId} id
 * @returns {Promise<void>}
 */

const deletePackageById = async (userId: string, id: string): Promise<void> => {
  if (!(await prisma.package.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Package not found')
  }
  await prisma.package.delete({
    where: {
      id,
      artistId: userId
    }
  })
}

export default {
  getAllPackages,
  getUserPackages,
  createUserPackage,
  deleteUserPackages,
  getPackageById,
  updatePackageById,
  deletePackageById
}
