// Strips everything that isn't letters, numbers, spaces. then replaces
// spaces with `-` for url purposes. then lower cases the result
function simplifyName (name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .toLowerCase();
}

function makeBuyersphereLink (buyersphere, section, subId) {
  if (subId) {
    return `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}/${section}/${subId}`
  } else if (section) {
    return `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}/${section}`
  } else {
    return `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}`
  }
}

export const useBuyersphereLinks = () => ({ 
  simplifyName,
  makeBuyersphereLink,
})
