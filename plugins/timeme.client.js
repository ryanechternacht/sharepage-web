import timeMe from 'timeme.js/timeme.min';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.timeMe = timeMe
})
