import local from "next/font/local"

const montserrat = local({
  src: "./montserrat/Montserrat-Regular.ttf",
  variable: "--font-montserrat",
})

const montserratBlack = local({
  src: "./montserrat/Montserrat-Black.ttf",
  variable: "--font-montserrat-black",
})

const montserratBold = local({
  src: "./montserrat/Montserrat-Bold.ttf",
  variable: "--font-montserrat-bold",
})

const montserratExtraBold = local({
  src: "./montserrat/Montserrat-ExtraBold.ttf",
  variable: "--font-montserrat-extra-bold",
})

const montserratExtraLight = local({
  src: "./montserrat/Montserrat-ExtraLight.ttf",
  variable: "--font-montserrat-extra-light",
})

const montserratItalic = local({
  src: "./montserrat/Montserrat-Italic.ttf",
  variable: "--font-montserrat-italic",
})

const montserratSemiBold = local({
  src: "./montserrat/Montserrat-SemiBold.ttf",
  variable: "--font-montserrat-semi-bold",
})

const fonts = {
  monteserrat: {
    regular: montserrat,
    black: montserratBlack,
    bold: montserratBold,
    extraBold: montserratExtraBold,
    extraLight: montserratExtraLight,
    italic: montserratItalic,
    semiBold: montserratSemiBold,
  },
}

export const monteserratVariables = `
  ${montserrat.variable} 
  ${montserratBlack.variable}
  ${montserratBold.variable}
  ${montserratExtraBold.variable}
  ${montserratExtraLight.variable}
  ${montserratItalic.variable}
  ${montserratSemiBold.variable}
`

export default fonts
