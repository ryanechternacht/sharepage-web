// Strips everything that isn't letters, numbers, spaces. then replaces
// spaces with `-` for url purposes. then lower cases the result
function simplifyName (name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .toLowerCase();
}

function makeSwaypageLink (swaypage, page) {
  return page
    ? `/${swaypage.id}/${simplifyName(swaypage.buyer)}/${page}`
    : `/${swaypage.id}/${simplifyName(swaypage.buyer)}`
}

export const useSwaypageLinks = () => ({ 
  simplifyName,
  makeSwaypageLink,
})
