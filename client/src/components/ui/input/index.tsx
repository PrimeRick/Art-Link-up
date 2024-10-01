import React, { ChangeEventHandler, forwardRef, MouseEvent } from "react"
import clsx from "clsx"
import Image, { StaticImageData } from "next/image"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string
  textClassName?: string
  parentClassName?: string
  variant?: keyof typeof variants
  mode?: "outlined" | "floating"
  prefixIcon?: StaticImageData
  containerClassName?: string
  onPrefixIconClick?: () => void
  suffixIcon?: StaticImageData
  onSuffixIconClick?: () => void
  onChangeHandler?: ChangeEventHandler<HTMLInputElement>
  clearable?: boolean
  onClear?: () => void
  showPassword?: boolean
  showPasswordIcon?: StaticImageData
  onShowPasswordClick?: () => void
  errorHandling?: {
    error?: string | null
    touched?: boolean
    clear?: () => void
    define?: (error: string) => void
  }
}

const RenderInput = (
  {
    className = "",
    disabled = false,
    variant = "primary",
    style,
    mode,
    // title,
    // textClassName,
    parentClassName,
    containerClassName,
    prefixIcon,
    onPrefixIconClick,
    suffixIcon,
    onSuffixIconClick,
    onChangeHandler,
    clearable = false,
    onClear,
    showPassword = false,
    showPasswordIcon,
    onShowPasswordClick,
    errorHandling,
    ...properties
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const BASE_CLASS = "w-full text-sm"

  const handleClearClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={clsx("w-full", containerClassName)}>
      <div
        className={clsx(
          "relative",
          mode === "floating" ? "rounded-lg" : "rounded-full",
          errorHandling?.error ? "border border-red-600/75" : "",
          parentClassName
        )}
      >
        {prefixIcon && (
          <div>
            <Image
              onClick={onPrefixIconClick}
              src={prefixIcon}
              className="absolute inset-y-0 left-3 top-[50%] flex -translate-y-[50%] items-center p-1"
              alt={""}
            />
          </div>
        )}
        {mode === "floating" ? (
          <div className="relative">
            <input
              id={properties?.placeholder?.toLowerCase()?.split(" ")?.join("-") ?? "input"}
              placeholder=""
              ref={ref}
              disabled={disabled}
              style={style}
              className={clsx(
                BASE_CLASS,
                "peer block w-full appearance-none rounded-lg border border-solid border-secondary-white bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0",
                className,
                prefixIcon ? "pl-10" : "",
                suffixIcon ? "pr-10" : ""
              )}
              onChange={(e) => {
                onChangeHandler?.(e)
                properties.onChange?.(e)
              }}
              {...(() => {
                const { onChange, placeholder, ...otherProperties } = properties
                onChange && console.warn("onChange is already handled")
                placeholder && console.warn("Placeholder is already handled")
                return otherProperties
              })()}
            />
            <label
              htmlFor={properties?.placeholder?.toLowerCase()?.split(" ")?.join("-") ?? "input"}
              className="text-md absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-primary-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-black"
            >
              {properties?.placeholder}
            </label>
          </div>
        ) : (
          <input
            ref={ref}
            disabled={disabled}
            style={style}
            className={clsx(
              BASE_CLASS,
              variant && variants[variant],
              className,
              prefixIcon ? "pl-10" : "",
              suffixIcon ? "pr-10" : ""
            )}
            onChange={(e) => {
              onChangeHandler?.(e)
              properties.onChange?.(e)
            }}
            {...(() => {
              const { onChange, ...otherProperties } = properties
              onChange && console.warn("onChange is already handled")
              return otherProperties
            })()}
          />
        )}
        {suffixIcon && (
          <div>
            <Image
              onClick={onSuffixIconClick}
              src={suffixIcon}
              className="absolute inset-y-0 right-3 top-[50%] flex -translate-y-[55%] items-center p-1"
              alt={""}
            />
          </div>
        )}
        {clearable && (
          <div
            className={`absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 ${
              suffixIcon ? "mr-8" : "mr-3"
            }`}
            onClick={handleClearClick}
          >
            Clear
          </div>
        )}
        {showPassword && (
          <div
            className={`absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 ${
              suffixIcon ? "mr-8" : "mr-3"
            }`}
            onClick={onShowPasswordClick}
          >
            {showPasswordIcon ? (
              <Image
                src={showPasswordIcon}
                className="absolute inset-y-0 right-0 top-[50%] flex -translate-y-[50%] items-center p-1"
                alt={""}
              />
            ) : (
              "Show"
            )}
          </div>
        )}
      </div>
      {errorHandling?.error && (
        <div
          className={clsx(
            "mt-1 text-[0.6rem] text-red-600/75",
            mode === "floating" ? "ml-1" : "ml-6"
          )}
        >
          {errorHandling.error}
        </div>
      )}
    </div>
  )
}

const Input: React.FC<InputProps> = forwardRef(RenderInput)

const variants = {
  primary:
    "rounded-full text-secondary-text py-4 px-6 text-xs sm:text-sm border-primary-black/75 focus:border-primary-black outline-none bg-light-gray mx-auto",
  secondary: "",
  link: "",
  pill: "",
}

export default Input
