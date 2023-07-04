// TODO should this be a composable instead?

export default defineNuxtPlugin((nuxtApp) => {
  const url = useRequestURL()
  const parts = url.host.split('.')
  parts.splice(1, 0, 'api')

  const apiUrlBase = url.protocol + '//' + parts.join('.')
  const apiUrl = (path) => new URL(path, apiUrlBase).toString()
  
  nuxtApp.apiFetch = async (path, options) => {
    const requestOptions = {...options}
    if (process.server) {
      const headers = useRequestHeaders(['cookie'])
      requestOptions.headers = {...requestOptions.headers, ...headers}
    } else {
      requestOptions.credentials = 'include'
    }
    return await useFetch(apiUrl(path), requestOptions)
  }
})
