const getEnvironmentVariable = (environmentVariable: string, fallback?: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable]

  if (!unvalidatedEnvironmentVariable) {
    console.log(`Couldn't find environment variable: ${environmentVariable}`)
    return fallback ?? ""
  }

  return unvalidatedEnvironmentVariable
}

// export const API_BASE_URL = getEnvironmentVariable(
//   "NEXT_PUBLIC_API_BASE_URL",
//   "http://localhost:3000/api/"
// )

export const SALT_ROUNDS = parseInt(getEnvironmentVariable("SALT_ROUNDS", "12"))
export const SECRET = getEnvironmentVariable("SECRET", "1143b916-020d-4191-8c07-dc01cd861105")
export const GOOGLE_ID = getEnvironmentVariable("GOOGLE_ID")
export const GOOGLE_SECRET = getEnvironmentVariable("GOOGLE_SECRET")
export const FACEBOOK_ID = getEnvironmentVariable("FACEBOOK_ID")
export const FACEBOOK_SECRET = getEnvironmentVariable("FACEBOOK_SECRET")
