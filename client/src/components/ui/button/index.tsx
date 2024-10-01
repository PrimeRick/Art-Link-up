import React from "react"
import clsx from "clsx"

const variants = {
  primary:
    "bg-primary-black hover:bg-primary-black/80 text-primary-white rounded-md disabled:bg-black/75 disabled:cursor-not-allowed",
  secondary:
    "border border-solid border-primary-black rounded-full hover:bg-primary-black/80 hover:text-primary-white text-primary-black",
  action:
    "bg-primary-black hover:bg-primary-black/80 text-primary-white rounded-md border border-solid border-primary-white",
  link: "",
  pill: "bg-primary-black hover:bg-primary-black/80 text-primary-white rounded-full disabled:bg-black/75 disabled:cursor-not-allowed",
}

interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
  textClassName?: string
  variant?: keyof typeof variants
  isLoading?: boolean
}

const Button = ({
  title,
  onClick,
  className = "",
  disabled = false,
  textClassName = "",
  variant = "primary",
  isLoading = false,
  children,
  type,
  style,
  ...properties
}: ButtonProperties) => {
  const BASE_CLASS = "transition-all duration-300 ease-in-out shadow-md"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={clsx(
        BASE_CLASS,
        variant && variants[variant],
        className,
        isLoading && "opacity-50"
      )}
      {...properties}
    >
      {children && children}
      {title && <p className={` ${textClassName}`}>{title}</p>}
    </button>
  )
}

export default Button
