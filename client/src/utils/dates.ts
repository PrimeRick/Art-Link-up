// This function calculates the difference between two dates in months
export const differenceInMonths = (date1: Date, date2: Date): number => {
  const months = (date1.getFullYear() - date2.getFullYear()) * 12
  return months - date2.getMonth() + date1.getMonth()
}

// This function calculates the difference between two dates in days
export const differenceInDays = (date1: Date, date2: Date): number => {
  const diffInMs = Math.abs(date1.getTime() - date2.getTime())
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}
