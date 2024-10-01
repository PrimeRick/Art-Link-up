import multer from 'multer'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Allow<T = any> = T | null

let uploadMemory: Allow
try {
  const storage = multer.memoryStorage()

  uploadMemory = multer({ storage })
} catch (error) {
  console.error('multer error', error)
}

export default uploadMemory
