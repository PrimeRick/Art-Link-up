import bcrypt from "bcrypt"

import { SALT_ROUNDS } from "@/config/env"

const saltRounds = SALT_ROUNDS

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}
