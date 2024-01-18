// Strips everything that isn't letters, numbers, spaces. then replaces
// spaces with `-` for url purposes. then lower cases the result
function simplifyName (name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .toLowerCase();
}

function makeBuyersphereLink (buyersphere, section) {
  return section
    ? `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}/${section}`
    : `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}`
}

export const useBuyersphereLinks = () => ({ 
  simplifyName,
  makeBuyersphereLink,
})
