import catchAsync from '../utils/catch-async'
import { sendResponse } from '../utils/response'
import { packageService } from '../services'
import httpStatus from 'http-status'

const getAllPackages = catchAsync(async (req, res) => {
  const AllPackages = await packageService.getAllPackages()
  sendResponse(res, httpStatus.OK, null, { packages: AllPackages }, 'sent successfully')
})

const getUserPackages = catchAsync(async (req, res) => {
  const userId = req.params.id as string
  const userPackages = await packageService.getUserPackages(userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { packages: userPackages },
    'User Packages fetched Successfully'
  )
})

const createUserPackage = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const packageBody = req.body
  const userPackage = await packageService.createUserPackage(userId, packageBody)
  sendResponse(
    res,
    httpStatus.CREATED,
    null,
    { packages: userPackage },
    'User Package created Successfully'
  )
})

const deleteUserPackages = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  await packageService.deleteUserPackages(userId)
  sendResponse(res, httpStatus.OK, null, null, 'User Packages deleted Successfully')
})

const getPackageById = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const singlepackage = await packageService.getPackageById(id)
  sendResponse(res, httpStatus.OK, null, { singlepackage }, 'User Package fetched Successfully')
})

const updatePackageById = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const id = req.params.id as string
  const updatePackageBody = req.body
  const userPackage = await packageService.updatePackageById(userId, id, updatePackageBody)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { package: userPackage },
    'User Package updated Successfully'
  )
})

const deletePackageById = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const id = req.params.id as string
  await packageService.deletePackageById(userId, id)
  sendResponse(res, httpStatus.OK, null, null, 'User Package deleted Successfully')
})

export default {
  getAllPackages,
  createUserPackage,
  deleteUserPackages,
  deletePackageById,
  updatePackageById,
  getPackageById,
  getUserPackages
}
