import React, { MouseEvent, useState } from "react"
import clsx from "clsx"
import Image, { StaticImageData } from "next/image"

interface CustomCheckboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  id: string
  checked: boolean
  disabled?: boolean
  label?: string
  checkedIcon?: StaticImageData
  variant?: keyof typeof variants
  onChange?: (checked: boolean, event?: MouseEvent<HTMLDivElement>) => void
}

const CustomCheckbox = ({
  id,
  //   checked,
  disabled = false,
  label,
  onChange,
  checkedIcon,
  variant = "square",
  ...props
}: CustomCheckboxProps) => {
  const [checked, setChecked] = useState(false)

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setChecked((prev) => {
      if (onChange) {
        onChange(!prev, event)
      }
      return !prev
    })
  }

  const checkboxStyles = clsx(
    "flex items-center justify-center w-5 h-5 border border-secondary-border",
    checked && "bg-primary",
    disabled && "cursor-not-allowed"
  )

  return (
    <span
      className={clsx(
        "flex cursor-pointer items-center overflow-hidden",
        variant && variants[variant],
        disabled && "cursor-not-allowed",
        checkboxStyles
      )}
      id={id}
      {...props}
      onClick={handleClick}
    >
      <>
        {checked &&
          (checkedIcon ? (
            <Image src={checkedIcon} alt={""} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="2.5 2 15 15"
              fill="none"
              className="scale-125"
            >
              <path
                d="M10 1.66667C5.40835 1.66667 1.66669 5.40834 1.66669 10C1.66669 14.5917 5.40835 18.3333 10 18.3333C14.5917 18.3333 18.3334 14.5917 18.3334 10C18.3334 5.40834 14.5917 1.66667 10 1.66667ZM13.9834 8.08334L9.25835 12.8083C9.14117 12.9254 8.98231 12.9911 8.81669 12.9911C8.65106 12.9911 8.49221 12.9254 8.37502 12.8083L6.01669 10.45C5.90045 10.3324 5.83527 10.1737 5.83527 10.0083C5.83527 9.84298 5.90045 9.68429 6.01669 9.56667C6.25835 9.325 6.65835 9.325 6.90002 9.56667L8.81669 11.4833L13.1 7.20001C13.3417 6.95834 13.7417 6.95834 13.9834 7.20001C14.225 7.44167 14.225 7.83334 13.9834 8.08334Z"
                fill="black"
              />
            </svg>
          ))}{" "}
      </>
      {label && <div className="ml-2">{label}</div>}
    </span>
  )
}

const variants = {
  rounded: "rounded-full",
  square: "rounded-md",
}

export default CustomCheckbox
