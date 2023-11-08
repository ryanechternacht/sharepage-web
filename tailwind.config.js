module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      // New colors
      teal: {
        primary: '#03837C',
        jewel: '#083F3F',
        bright: '#08C4B2',
        pastel: '#ccf1ea',
        background: '#ecf9f8'
      },
      blue: {
        primary: '#0A2960',
        jewel: '#0C3F89',
        bright: '#205BC3',
        pastel: '#c7dbf9',
        background: '#e7ebfd',
      },
      black: '#040404',
      green: {
        darker: '#1F605D',
        jewel: '#006B40',
        bright: '#59CB59',
        pastel: '#ebf9eb',
        background: '#ecf9f8',
      },
      purple: {
        jewel: '#6C2277',
        bright: '#AC44A8',
        pastel: '#d8d7f9',
        background: '#e7ebfd',
      },
      red: {
        jewel: '#931847',
        bright: '#CE3665',
        pastel: '#fcdccc',
        background: '#f8ecec',
      },
      orange: {
        jewel: '#DD9903',
        bright: '#FFBC00',
        pastel: '#fdefcd',
        background: '#fff9e5',
      },
      gray: {
        lightest: '#FaFaFa',
        lighter: '#F3F4F4',
        light: '#DEE1E1',
        mid: '#515E5F',
        dark: '#364141',
        darker: '#273333',
      },
      white: '#fff',
      yellow: {
        pastel: '#FFF7E7',
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      rajdhani: ['Rajdhani', 'sans-serif']
    },
    extend: {
      spacing: {
        '.5': '.125rem'
      }
      // TODO is it worth it to add max-w-XXX here like I use in icons?
    }
  },
}
