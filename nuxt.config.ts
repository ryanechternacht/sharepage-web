// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lodash', '@pinia/nuxt'],
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
  }
})
