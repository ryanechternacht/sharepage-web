// Strips everything that isn't letters, numbers, spaces. then replaces
// spaces with `-` for url purposes. then lower cases the result
function simplifyName (name) {
  if (!name) {
    return ""
  }
  
  return name.replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .toLowerCase();
}

function makeInternalSwaypageLink (swaypage, page) {
  return page
    ? `/${swaypage.id}/${simplifyName(swaypage.buyer)}/${page}`
    : `/${swaypage.id}/${simplifyName(swaypage.buyer)}`
}

// requestUrl should be the result of useRequestUrl()
function makePersonalizedExternalSwaypageLink (requestUrl, shortcode, name) {
  const urlBase =  requestUrl.protocol + '//' + requestUrl.host;
  const path = `/u/${shortcode}/${name}`
  return new URL(path, urlBase).href
}

// requestUrl should be the result of useRequestUrl()
function makeExternalSwaypageLink (requestUrl, shortcode, companyName) {
  const urlBase =  requestUrl.protocol + '//' + requestUrl.host;
  const path = `/c/${shortcode}/${simplifyName(companyName)}`
  return new URL(path, urlBase).href
}

export const useSwaypageLinks = () => ({ 
  makeInternalSwaypageLink,
  makeExternalSwaypageLink,
  makePersonalizedExternalSwaypageLink,
})
