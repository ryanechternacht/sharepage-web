// TODO should this be a composable instead?
import lodash_pkg from 'lodash';
const { camelCase, transform, isArray, isObject } = lodash_pkg;

const camelize = obj => transform(obj, (acc, value, key, target) => {
  const camelKey = isArray(target) ? key : camelCase(key);
  
  acc[camelKey] = isObject(value) ? camelize(value) : value;
});

export default defineNuxtPlugin(async (nuxtApp) => {
  const url = useRequestURL()
  const parts = url.host.split('.')

  // save slug in case we need it (auth does)
  nuxtApp.apiSlug = parts[0]

  parts.splice(1, 0, 'api')

  // TODO should we just pull this from config?
  const apiUrlBase = url.protocol + '//' + parts.join('.')
  
  // save for later (campaign links need this)
  nuxtApp.apiBaseUrl = apiUrlBase
  
  const apiUrl = (path) => new URL(path, apiUrlBase).toString()

  nuxtApp.apiFetch = async (path, options) => {
    const requestOptions = {...options, transform: camelize}
    if (!requestOptions.headers) {
      requestOptions.headers = {}
    }
    if (process.server) {
      const headers = useRequestHeaders(['cookie'])
      requestOptions.headers = {...requestOptions.headers, ...headers}
    } else {
      requestOptions.credentials = 'include'
    }

    // By default, nuxt was trying to intelligently refresh requests,
    // which was causing api calls to be repeated without me realizing it.
    // This suggests to me what I'm doing here is a bad idea, and I should
    // find a better way to achieve this
    requestOptions.watch = false

    // This idea here is well supported online, but I think my pinia approach
    // of caching would be better served by leveraging nuxt caching directly
    return await useFetch(apiUrl(path), requestOptions)
  }
})
