// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // We used to use a nested page approach to extract the largely
  // duplicative page layout logic in [[page]].vue and feed.vue. however
  // this ran into a very annoying bug where the tiptap areas would be
  // double mounted. It appears this is a vue bug according to the nuxt 
  // documentation on transitions. (https://github.com/vuejs/core/issues/5513). 
  // In theory, this bug was fixed in 3.4.8ish, but it's still a problem for
  // tiptap anyway. so no transitions until this is fixed
  app: {
    // layoutTransition: { name: 'layout', mode: 'out-in' },
    // pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: ['assets/css/tailwind.css'],

  modules: [
    'nuxt-lodash',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    'dayjs-nuxt',
    'floating-vue/nuxt',
    '@nuxt/ui',
  ],

  build: {
    transpile: [
      "@vuepic/vue-datepicker",
    ],
  },

  dayjs: {
    plugins: [
      'advancedFormat', 
      'calendar',
      'duration', 
      'isSameOrAfter', 
      'relativeTime',
      'utc',
    ]
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
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Roboto: [500] // for the google login button
    }
  },

  devtools: {
    enabled: false,
  },

  vite: {
    plugins: [
    ]
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
