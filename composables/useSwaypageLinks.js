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
    ? `/old/${swaypage.id}/${simplifyName(swaypage.buyer)}/${page}`
    : `/old/${swaypage.id}/${simplifyName(swaypage.buyer)}`
}

function makeNewSwaypageLink (swaypage, page) {
  return page
    ? `/${swaypage.id}/${simplifyName(swaypage.buyer)}/${page}`
    : `/${swaypage.id}/${simplifyName(swaypage.buyer)}`
}

function makePersonalizedExternalSwaypageLink (shortcode, name) {
  return `/u/${shortcode}/${name}`
}

function makeExternalSwaypageLink (shortcode, companyName) {
  return `/c/${shortcode}/${simplifyName(companyName)}`
}

export const useSwaypageLinks = () => ({ 
  makeInternalSwaypageLink,
  makeExternalSwaypageLink,
  makePersonalizedExternalSwaypageLink,
  makeNewSwaypageLink,
})
