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

function makeInternalSharepageLink (sharepage, thread) {
  return thread
    ? `/${sharepage.id}/${simplifyName(sharepage.buyer)}/${thread}`
    : `/${sharepage.id}/${simplifyName(sharepage.buyer)}`
}

function makeSharepageThreadSettingsLink (sharepage, threadId) {
  return `/${sharepage.id}/${simplifyName(sharepage.buyer)}/${threadId}/settings`
}

// requestUrl should be the result of useRequestUrl()
function makePersonalizedExternalSharepageLink (requestUrl, shortcode, name) {
  const urlBase =  requestUrl.protocol + '//' + requestUrl.host;
  const path = `/u/${shortcode}/${name}`
  return new URL(path, urlBase).href
}

// requestUrl should be the result of useRequestUrl()
function makeExternalSharepageLink (requestUrl, shortcode, companyName) {
  const urlBase =  requestUrl.protocol + '//' + requestUrl.host;
  const path = `/c/${shortcode}/${simplifyName(companyName)}`
  return new URL(path, urlBase).href
}

// apiUrlBase is found in useNuxtApp()
function makeCampaignDownloadLink (apiUrlBase, campaign) {
  const path = `/v0.1/campaign/${campaign.uuid}/published-csv`
  return new URL(path, apiUrlBase).toString()
}

function makeVirtualSharepageLink (shortcode, name, page) {
  return page
    ? `/v/${shortcode}/${name}/${page}`
    : `/v/${shortcode}/${name}`
}

export const useSharepageLinks = () => ({ 
  makeInternalSharepageLink,
  makeExternalSharepageLink,
  makePersonalizedExternalSharepageLink,
  makeSharepageThreadSettingsLink,
  makeCampaignDownloadLink,
  makeVirtualSharepageLink,
})
