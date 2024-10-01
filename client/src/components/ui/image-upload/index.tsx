import React from "react"
import clsx from "clsx"
import ReactImageUploading, { ImageListType, ImageUploadingPropsType } from "react-images-uploading"

interface ImageUploadProps extends Omit<ImageUploadingPropsType, "value" | "dataURLKey"> {
  className?: string
  AddContainer?: React.FC
  ImageContainer?: React.FC<{
    src: string
    onImageUpdate: () => void
    onImageRemove: () => void
  }>
  dragDecoration?: string
  errorDecoration?: string
  addWrapperClass?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  className,
  dragDecoration,
  addWrapperClass,
  AddContainer,
  ImageContainer,
  errorDecoration,
  ...props
}) => {
  const { multiple, onChange, maxNumber = 69, ...properties } = props

  const [images, setImages] = React.useState<ImageListType>([])

  const handleImageChange = (imageList: ImageListType, addUpdateIndex?: number[] | undefined) => {
    onChange?.(imageList, addUpdateIndex)
    setImages(imageList)
  }

  return (
    <ReactImageUploading
      multiple={multiple ?? false}
      value={images}
      onChange={handleImageChange}
      maxNumber={maxNumber ?? 1}
      dataURLKey={"data_url"}
      {...properties}
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
        errors,
      }) => {
        const errorOccured =
          errors?.acceptType || errors?.maxNumber || errors?.maxFileSize || errors?.resolution

        return (
          <div className={clsx("", className)}>
            {imageList?.length < maxNumber ? (
              <button
                className={clsx(
                  "center h-64 w-64",
                  addWrapperClass ? addWrapperClass : "",
                  isDragging ? "" : "",
                  errorOccured ? "text-red-500" : "",
                  isDragging && dragDecoration ? dragDecoration : "",
                  errorOccured && errorDecoration ? errorDecoration : ""
                )}
                onClick={onImageUpload}
                {...dragProps}
              >
                {AddContainer?.({}) ?? "Click or Drop here"}
              </button>
            ) : (
              <></>
            )}
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            {imageList.map((image, index) =>
              ImageContainer ? (
                ImageContainer?.({
                  src: image["data_url"],
                  onImageUpdate: () => onImageUpdate(index),
                  onImageRemove: () => onImageRemove(index),
                })
              ) : (
                <div key={index} className="">
                  <img src={image["data_url"]} alt="" width="100" />
                  <div className="">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              )
            )}
          </div>
        )
      }}
    </ReactImageUploading>
  )
}

export default ImageUpload
