// declare type Callback<T = unknown, P = Error | null> = (error?: P, data?: T) => void

declare type InternalResponse<T = unknown, P = Error | null> = {
  success: "success" | "failure" | "pending"
  message: string
  data?: T
  error?: P
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Allow<T = any> = T | null
