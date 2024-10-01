import httpStatus from 'http-status'
import catchAsync from '../utils/catch-async'
import { uploadService } from '../services'
import { sendResponse } from '../utils/response'

const uploadFile = catchAsync(async (req, res) => {
  //@ts-expect-error: Should expect files
  const { file } = req.files
  if (!file) {
    sendResponse(res, httpStatus.BAD_REQUEST, { code: 400 }, null, 'No file uploaded')
  } else {
    const response = await uploadService.uploadFile(file)
    sendResponse(res, httpStatus.OK, null, { image: response }, 'Image successfully uploaded')
  }
})

// const uploadFiles = catchAsync(async (req, res) => {
//   const files = req.files
//   if (!files || files.length === 0) {
//     sendResponse(res, httpStatus.BAD_REQUEST, { code: 400 }, null, 'No file uploaded')
//   } else {
//     const response = await uploadService.uploadFiles(files)

//     sendResponse(res, httpStatus.OK, null, { image: response }, 'Image successfully uploaded')
//   }
// })
const uploadFiles = catchAsync(async (req, res) => {
  //@ts-expect-error: Should expect files
  const { files } = req.files
  // console.log("files ",req.files)
  if (!files || files.length === 0) {
    sendResponse(res, httpStatus.BAD_REQUEST, { code: 400 }, null, 'No file uploaded')
  } else {
    const response = await uploadService.uploadFiles(files)

    sendResponse(res, httpStatus.OK, null, { image: response }, 'Image successfully uploaded')
  }
})

export default {
  uploadFile,
  uploadFiles
}
