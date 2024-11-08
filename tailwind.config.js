module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      green: {
        '50': '#eefbf2',
        '100': '#d6f5de',
        '200': '#b0eac2',
        '300': '#68d391', // good
        '400': '#47c079',
        '500': '#24a55e',
        '600': '#16854b',
        '700': '#126a3e',
        '800': '#105532',
        '900': '#0e462b',
        '950': '#072718',
      },
      blue: {
        brand: '#007FFF',
        '50': '#eef8ff',
        '100': '#d9efff',
        '200': '#bce3ff',
        '300': '#8ed3ff',
        '400': '#59b8ff',
        '500': '#41a0ff', // great
        '600': '#1b79f5',
        '700': '#1463e1',
        '800': '#174fb6',
        '900': '#19458f',
        '950': '#142b57',
      },
      black: '#040506',
      red: {
        '50': '#fff1f1',
        '100': '#ffe1e1',
        '200': '#ffc7c7',
        '300': '#ffa0a0',
        '400': '#ff6b6b', // alert
        '500': '#f83b3b',
        '600': '#e51d1d',
        '700': '#c11414',
        '800': '#a01414',
        '900': '#841818',
        '950': '#480707',
      },
      orange: {
        '50': '#fff9eb',
        '100': '#ffeec6',
        '200': '#ffda88',
        '300': '#ffc658', // neutral
        '400': '#ffa920',
        '500': '#f98507',
        '600': '#dd6002',
        '700': '#b74006',
        '800': '#94300c',
        '900': '#7a290d',
        '950': '#461302',
    },
      gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6', // border-light (#F6F7F8)
        '200': '#e5e7eb', // border-dark (#ECEFF4)
        '300': '#d1d5db',
        '400': '#9ca3af', // medium (#7C8C9C)
        '500': '#6b7280', // subtext (#7C8C9C)
        '600': '#4b5563',
        '700': '#374151', // body (#364141)
        '800': '#1f2937', // darker (#131920), dark (#2D3D4D)
        '900': '#111827',
        '950': '#030712',
      },
      white: '#FFF',
      current: 'currentColor', // for some nuxt UI components
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xl: ['1.625rem', { fontWeight: '800' } ],
      lg: ['1.25rem', { fontWeight: '600' } ],
      base: ['.875rem', { fontWeight: '500' } ],
      sm: ['.875rem', { fontWeight: '400' } ],
      xs: ['.75rem', { fontWeight: '400' } ],
    },
    extend: {
      spacing: {
        '.5': '.125rem'
      },
    }
  },
}
