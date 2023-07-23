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
  parts.splice(1, 0, 'api')

  const apiUrlBase = url.protocol + '//' + parts.join('.')
  const apiUrl = (path) => new URL(path, apiUrlBase).toString()
  
  nuxtApp.apiFetch = async (path, options) => {
    const requestOptions = {...options, transform: camelize}
    if (process.server) {
      const headers = useRequestHeaders(['cookie'])
      requestOptions.headers = {...requestOptions.headers, ...headers}
    } else {
      requestOptions.credentials = 'include'
    }
    // TODO switch to useAsyncData to get call dedpulciation
    return await useFetch(apiUrl(path), requestOptions)
  }
})
