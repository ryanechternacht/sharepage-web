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

function makeSwaypageChapterSettingsLink (swaypage, pageId) {
  return `/${swaypage.id}/${simplifyName(swaypage.buyer)}/${pageId}/settings`
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

// apiUrlBase is found in useNuxtApp()
function makeCampaignDownloadLink (apiUrlBase, campaign) {
  const path = `/v0.1/campaign/${campaign.uuid}/published-csv`
  return new URL(path, apiUrlBase).toString()
}

function makeVirtualSwaypageLink (shortcode, name, page) {
  return page
    ? `/v/${shortcode}/${name}/${page}`
    : `/v/${shortcode}/${name}`
}

export const useSwaypageLinks = () => ({ 
  makeInternalSwaypageLink,
  makeExternalSwaypageLink,
  makePersonalizedExternalSwaypageLink,
  makeSwaypageChapterSettingsLink,
  makeCampaignDownloadLink,
  makeVirtualSwaypageLink,
})
