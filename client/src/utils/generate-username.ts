import { v4 } from "uuid"

const generateUsername = (firstName = "", lastName = "", uniqueIdentifier = "") => {
  // Remove any spaces and convert to lowercase
  firstName = firstName.trim().toLowerCase()
  lastName = lastName.trim().toLowerCase()
  uniqueIdentifier = uniqueIdentifier.trim().toLowerCase()

  // Generate a unique identifier using uuid
  const uniquePart = v4().split("-").join("").substring(0, 8)

  // Concatenate the provided arguments and the unique identifier
  const username =
    (firstName || "user") +
    (lastName ? "." + lastName : "") +
    (uniqueIdentifier ? "." + uniqueIdentifier : "") +
    "." +
    uniquePart

  return username
}

export default generateUsername
