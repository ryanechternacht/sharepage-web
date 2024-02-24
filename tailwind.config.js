module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      // New colors
      green: {
        primary: '#057A6F',
        secondary: '#09DCC8',
        background: '#DDECEA',
      },
      blue: {
        primary: '#36597c',
        secondary: '#5f8cb9',
        background: '#DFE8F1',
      },
      black: '#040404',
      purple: {
        secondary: '#AC44A8',
        background: '#EAE6F2',
      },
      red: {
        primary: '#753d3d',
        secondary: '#B06868',
        background: '#F2E6E6',
      },
      orange: {
        primary: '#935420',
        secondary: '#DFA16C',
        background: '#FCF6F1',
      },
      gray: {
        headline: '#273333',
        body: '#364141',
        subtext: '#515E5F',
        'not-selected': '#929A9B',
        inactive: '#DEE1E1',
        border: '#E8E9ED',
        hover: '#F8F8FA',
        'hover-active': '#f3f4f4'
      },
      white: '#FFF'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      rajdhani: ['Rajdhani', 'sans-serif']
    },
    extend: {
      spacing: {
        '.5': '.125rem'
      },
      // TODO is it worth it to add max-w-XXX here like I use in icons?
    }
  },
}
