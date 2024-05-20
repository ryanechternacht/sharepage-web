// from https://github.com/bennyxguo/vue3-scroll-spy/issues/2
// import { registerScrollSpy } from 'vue3-scroll-spy?client';

// TODO what to do about scrollspy?
export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  
  // if (nuxtApp.ssrContext) {
  //   app.directive('scroll-spy', {})
  //   app.directive('scroll-spy-active', {})
  //   app.directive('scroll-spy-link', {})
  // } else if (typeof registerScrollSpy !== 'undefined') {
  //   registerScrollSpy(app);
  // }
})
