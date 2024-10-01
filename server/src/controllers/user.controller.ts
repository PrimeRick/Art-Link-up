import httpStatus from 'http-status'
import ApiError from '../utils/api-error'
import catchAsync from '../utils/catch-async'
import { userService } from '../services'
import { sendResponse } from '../utils/response'
import { RoleType } from '@prisma/client'
import prisma from '../client'

const createUser = catchAsync(async (req, res) => {
  const { email, password, username, first_name, last_name } = req.body
  const user = await userService.createUser(
    email,
    password,
    username,
    first_name,
    RoleType.CLIENT,
    last_name
  )
  sendResponse(res, httpStatus.CREATED, null, { user }, 'User Created successfully')
})
const createArtist = catchAsync(async (req, res) => {
  const { email, password, username, first_name, last_name } = req.body
  const user = await userService.createUser(
    email,
    password,
    username,
    first_name,
    RoleType.ARTIST,
    last_name
  )
  sendResponse(res, httpStatus.CREATED, null, { user }, 'Artist Created successfully')
})
const createAdmin = catchAsync(async (req, res) => {
  const { email, password, username, first_name, last_name } = req.body
  const user = await userService.createUser(
    email,
    password,
    username,
    first_name,
    RoleType.ADMIN,
    last_name
  )
  await prisma.adminPayment.create({
    data: {
      earnings: 0,
      payouts: 0,
      userId: user.id
    }
  })
  sendResponse(res, httpStatus.CREATED, null, { user }, 'Admin Created successfully')
})

const getUsers = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['username', 'role'])
  // const options = pick(req.query, ['sortBy', 'limit', 'page'])
  const search = (req.query.search as string) || ''
  const { page = 1, limit = 10 } = req.query
  const parsedPage = parseInt(page as string)
  const parsedLimit = parseInt(limit as string)
  const users = await userService.getAllUsers(search, parsedLimit, parsedPage)
  sendResponse(res, httpStatus.OK, null, { users }, 'Users fetched Successfully')
})

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  sendResponse(res, httpStatus.OK, null, { user }, 'User fetched Successfully')
})

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId as string
  const user = await userService.updateUserById(userId, req.body)
  sendResponse(res, httpStatus.CREATED, null, { user }, 'User updated Successfully')
})

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(res.locals.user.id)
  sendResponse(res, httpStatus.OK, null, null, 'User deleted Successfully')
})

const getCustomDetails = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const customDetails = await userService.getCustomDetails(id)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { user: customDetails },
    'User Details fetched Successfully'
  )
})

const getAllArtists = catchAsync(async (req, res) => {
  const artistDetails = await userService.getAllArtists()
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { users: artistDetails },
    'Artists Details fetched Successfully'
  )
})
const getAllAdmins = catchAsync(async (req, res) => {
  const adminDetails = await userService.getAllAdmins()
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { users: adminDetails },
    'Admins Details fetched Successfully'
  )
})
const getAllClients = catchAsync(async (req, res) => {
  const clientDetails = await userService.getAllClients()
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { users: clientDetails },
    'Clients Details fetched Successfully'
  )
})

const getUserById = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const userDetails = await userService.getUserByuserId(id)
  sendResponse(res, httpStatus.OK, null, { user: userDetails }, 'User Details fetched Successfully')
})
const changeUserRole = catchAsync(async (req, res) => {
  const id = req.params.id as string
  await userService.changeUserRole(id)
  sendResponse(res, httpStatus.OK, null, null, 'User role changed Successfully')
})

const deleteUserByuserId = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.id)
  sendResponse(res, httpStatus.OK, null, null, 'User deleted Successfully')
})

export default {
  createUser,
  createArtist,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCustomDetails,
  getAllClients,
  getAllArtists,
  getAllAdmins,
  getUserById,
  createAdmin,
  changeUserRole,
  deleteUserByuserId
}
