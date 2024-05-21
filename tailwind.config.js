module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      // New colors
      // ryan
      green: {
        primary: '#057A6F',
        secondary: '#09DCC8',
        background: '#DDECEA',
        good: '#68D391', // new
      },
      blue: {
        primary: '#36597c',
        secondary: '#5f8cb9',
        background: '#DFE8F1',
        great: '#41A0FF', // new
        brand: '#007FFF', // new
        // ryan
        500: '#36597c',
      },
      black: '#040506', // new
      purple: {
        secondary: '#AC44A8',
        background: '#EAE6F2',
      },
      red: {
        primary: '#753d3d',
        secondary: '#B06868',
        background: '#F2E6E6',
        alert: '#FF6B6B', // new,
        // ryan
        500: 'red',
        400: 'red',
      },
      orange: {
        primary: '#935420',
        secondary: '#DFA16C',
        background: '#FCF6F1',
        neutral: '#FFC658', // new
      },
      gray: {
        darker: '#131920', // new
        dark: '#2D3D4D', // new
        medium: '#7C8C9C', // new
        background: '#ECEFF4', // new
        'border-dark': '#ECEFF4', // new
        'border-light': '#F6F7F8', // new
        headline: '#273333',
        body: '#364141',
        subtext: '#515E5F',
        'not-selected': '#929A9B',
        inactive: '#DEE1E1',
        border: '#E8E9ED',
        hover: '#F3F3F5',
        'hover-active': '#f3f4f4',
        // ryan
        500: '#7C8C9C'
      },
      white: '#FFF'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      // rajdhani: ['Rajdhani', 'sans-serif']
    },
    fontSize: {
      primary: ['1.625rem', { fontWeight: '800'} ],
      secondary: ['1rem', { fontWeight: '600'} ],
      body: ['.875rem', { fontWeight: '500'} ],
      subtext: ['.875rem', { fontWeight: '500'} ],
    },
    extend: {
      spacing: {
        '.5': '.125rem'
      },
      // TODO is it worth it to add max-w-XXX here like I use in icons?
    }
  },
}
