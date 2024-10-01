const ConverasationSkeleton = () => {
  return (
    <div className="flex items-center gap-3 rounded-xl p-3">
      <div className="h-14 w-14 animate-pulse rounded-full bg-neutral-400" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-400" />
        <div className="h-3 w-36 animate-pulse rounded-full bg-neutral-400" />
      </div>
    </div>
  )
}

export default ConverasationSkeleton
