// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: ['vue-final-modal/style.css'],

  modules: [
    '@nuxtjs/tailwindcss', 
    'nuxt-lodash', 
    '@pinia/nuxt', 
    '@nuxtjs/google-fonts',
    'dayjs-nuxt',
  ],

  runtimeConfig: {
    public: {
      // set in .env
      stytchBaseUrl: '',
      stytchPublicToken: '',
      stytchRedirectUrl: '',
    }
  },

  dayjs: {
    plugins: ['isSameOrAfter', 'duration', 'advancedFormat']
  },

  postcss: {
    // Add plugin names as key and arguments as value
    // Install them before as dependencies with npm or yarn
    plugins: {
      // Disable a plugin by passing false as value
      // 'postcss-url': false,
      // 'postcss-nested': {},
      // 'postcss-responsive-type': {},
      // 'postcss-hexrgba': {}
    },
  },

  googleFonts: {
    families: {
      // TODO only grab the right ones
      Rajdhani: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Roboto: [500] // for the google login button
    }
  },

  devtools: {
    enabled: false,
  },

  nitro: {
    inlineDynamicImports: true
    // TODO this for prod? https://stackoverflow.com/questions/74570188/how-do-i-set-proxy-in-nuxt3
    // devProxy: {
    //   '/api': {
    //     target: 'http://api.localhost:3001',
    //     changeOrigin: true
    //   }
    // }
  }
})
