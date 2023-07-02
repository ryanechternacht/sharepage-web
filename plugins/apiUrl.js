// TODO should this be a composable instead?

export default defineNuxtPlugin((nuxtApp) => {
  const url = useRequestURL()
  const parts = url.host.split('.')
  parts.splice(1, 0, 'api')
  
  nuxtApp.apiUrl = url.protocol + '//' + parts.join('.')
})
