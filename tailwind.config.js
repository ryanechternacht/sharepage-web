module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      // New colors
      green: {
        primary: '#08C4B2',
        background: '#ECF9F8',
      },
      blue: {
        primary: '#205BC3',
        background: '#e7ebfd',
      },
      black: '#040404',
      purple: {
        secondary: '#AC44A8',
        background: '#F8F4FF',
      },
      red: {
        secondary: '#CE3665',
        background: '#F8ECEC',
      },
      orange: {
        secondary: '#DD9903',
        background: '#FFF9E5',
      },
      cream: {
        background: '#FBFBFB',
        highlight: '#F3F4F4'
      },
      gray: {
        headline: '#273333',
        body: '#364141',
        subtext: '#515E5F',
        border: '#F8F8FA',
        hover: '#F3F3F5',
        'hover-active': '#DEE1E1'
      },
      white: '#fff'
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
