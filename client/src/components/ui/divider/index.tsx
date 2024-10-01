import React from "react"
import clsx from "clsx"

interface DividerProps {
  className?: string
  parentClassName?: string
  content?: string
}

const Divider: React.FC<DividerProps> = ({ className, content, parentClassName }) => {
  return (
    <div className={clsx("center w-full gap-2", parentClassName)}>
      <hr className={clsx("w-full grow", className)} />
      <span>{content}</span>
      <hr className={clsx("w-full grow", className)} />
    </div>
  )
}

export default Divider
