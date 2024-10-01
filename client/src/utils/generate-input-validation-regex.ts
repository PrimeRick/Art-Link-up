const generateRegex = (
  type: React.HTMLInputTypeAttribute
): {
  regex: RegExp
  minLength: number
  maxLength: number
  errorMessage?: string
} => {
  switch (type) {
    case "text":
      return {
        regex: /^.{1,1000}$/,
        minLength: 1,
        maxLength: 1000,
      }
    case "email":
      return {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        minLength: 1,
        maxLength: 360,
      }
    case "password":
      return {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        minLength: 8,
        maxLength: 255,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long",
      }
    case "number":
      return {
        regex: /^[0-9]+$/,
        minLength: 1,
        maxLength: 1000,
        errorMessage: "Please enter a valid number",
      }
    case "tel":
      return {
        regex: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        minLength: 10,
        maxLength: 10,
      }
    case "url":
      return {
        regex: /^(ftp|http|https):\/\/[^ "]+$/,
        minLength: 1,
        maxLength: 360,
      }
    default:
      return {
        regex: /^.*$/,
        minLength: 0,
        maxLength: 1000,
      }
  }
}

export default generateRegex
