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
        '50': '#eef8ff',
        '100': '#d9efff',
        '200': '#bce3ff',
        '300': '#8ed3ff',
        '400': '#59b8ff',
        '500': '#41a0ff',
        '600': '#1b79f5',
        '700': '#1463e1',
        '800': '#174fb6',
        '900': '#19458f',
        '950': '#142b57',
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
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
      },
      white: '#FFF'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      // rajdhani: ['Rajdhani', 'sans-serif']
    },
    fontSize: {
      xl: ['1.625rem', { fontWeight: '800'} ],
      lg: ['1rem', { fontWeight: '600'} ],
      base: ['.875rem', { fontWeight: '500'} ],
      sm: ['.875rem', { fontWeight: '500'} ],
      xs: ['.75rem', { fontWeight: '400'} ],
    },
    extend: {
      spacing: {
        '.5': '.125rem'
      },
      // TODO is it worth it to add max-w-XXX here like I use in icons?
    }
  },
}
