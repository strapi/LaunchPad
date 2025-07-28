import localFont from 'next/font/local'

// Define your Persian/Arabic font
export const persianFont = localFont({
  src: [
    {
      path: '../public/fonts/vazir-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/vazir-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-persian',
  display: 'swap',
})

// Define your Arabic font if needed
export const arabicFont = localFont({
  src: [
    {
      path: '../public/fonts/noto-sans-arabic-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/noto-sans-arabic-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-arabic',
  display: 'swap',
})

// You can also define font for other languages if needed
export const hebrewFont = localFont({
  src: '../public/fonts/hebrew-font.woff2',
  variable: '--font-hebrew',
  weight: '400',
  display: 'swap',
})
