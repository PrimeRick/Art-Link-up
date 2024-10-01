import React, { ReactNode, useEffect, useState } from "react"
const rendererKeys = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "ul",
  "ol",
  "li",
  "code",
  "code_block",
  "html",
  "strong",
] as const

type RendererProps = {
  children: ReactNode
  className?: string
}

type RenderersType = {
  [key in (typeof rendererKeys)[number]]: ({ children }: RendererProps) => JSX.Element
}

type RichTextProps = {
  content: Array<{
    type: keyof RenderersType
    content: string
    className?: string
  }>
}

const sharedClasses = ""
const bodyClasses = "text-lg"
const formatText = (inputText: string) => {
  let formattedText = ""
  let boldFlag = false

  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === "*") {
      boldFlag = !boldFlag
      formattedText += boldFlag ? '<strong className="font-bold">' : "</strong>"
    } else {
      formattedText += inputText[i]
    }
  }

  return formattedText
}

const renderers: RenderersType = {
  h1: ({ children, className }) => (
    <h1 className={`mb-4 text-4xl text-gray-900 lg:text-5xl ${sharedClasses} ${className}`}>
      {children}
    </h1>
  ),
  h2: ({ children, className }) => (
    <h2
      className={`mb-4 text-3xl text-gray-900 md:text-5xl lg:text-6xl ${sharedClasses} ${className}`}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className }) => (
    <h3 className={`text-2xl md:text-3xl ${sharedClasses} ${className}`}>{children}</h3>
  ),
  h4: ({ children, className }) => (
    <h4 className={`text-2xl ${sharedClasses} ${className}`}>{children}</h4>
  ),
  h5: ({ children, className }) => (
    <h5 className={`text-xl ${sharedClasses} ${className}`}>{children}</h5>
  ),
  h6: ({ children, className }) => (
    <h6 className={`text-large ${sharedClasses} ${className}`}>{children}</h6>
  ),
  p: ({ children, className }) => (
    <p
      className={`text-light my-4 text-sm text-primary-gray md:text-lg ${bodyClasses} ${sharedClasses} ${className}`}
    >
      {children}
    </p>
  ),
  ul: ({ children, className }) => (
    <ul
      className={`my-4 list-inside list-disc text-lg ${bodyClasses} ${sharedClasses} ${className}`}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className }) => (
    <ol
      className={`my-4 list-inside list-decimal text-lg ${bodyClasses} ${sharedClasses} ${className}`}
    >
      {children}
    </ol>
  ),
  li: ({ children, className }) => (
    <li className={`my-2 text-lg ${bodyClasses} ${sharedClasses} ${className}`}>{children}</li>
  ),
  code: ({ children, className }) => (
    <code
      className={`rounded-md bg-gray-100 p-2 text-sm dark:bg-gray-800 ${sharedClasses} ${className}`}
    >
      {children}
    </code>
  ),
  code_block: ({ children, className }) => (
    <pre
      className={`overflow-y-scroll rounded-md bg-gray-100 p-2 text-sm dark:bg-gray-800 ${sharedClasses} ${className}`}
    >
      {children}
    </pre>
  ),
  html: ({ children, className }) => (
    <div
      className={`my-4 text-sm text-primary-gray md:text-lg ${bodyClasses} ${sharedClasses} ${className}`}
      dangerouslySetInnerHTML={{
        __html: (children as string).replaceAll("\n", "<br />") as TrustedHTML,
      }}
    />
  ),
  strong: ({ children }) => {
    const x = formatText(children as string)

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: x as string }} />
      </>
    )
  },
}
const RichText = ({ content }: RichTextProps) => {
  const [htm, setHtm] = useState<Array<React.JSX.Element>>([])

  useEffect(() => {
    const htmlContent: Array<React.JSX.Element> = []
    let html = <></>

    for (const obj of content) {
      const renderer = renderers[obj.type]
      if (renderer) {
        html = renderer({ children: obj.content, className: obj.className ?? "" })
      } else {
        html = <>{obj.content}</>
      }
      htmlContent.push(html)
    }
    setHtm(htmlContent)
  }, [content])

  return <div>{...htm}</div>
}

export default RichText
