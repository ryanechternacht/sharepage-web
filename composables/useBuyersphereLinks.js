function simplifyName (name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .toLowerCase();
}

function makeBuyersphereLink (buyersphere, section) {
  return `/${buyersphere.id}/${simplifyName(buyersphere.buyer)}/${section}`
}

export const useBuyersphereLinks = () => ({ 
  simplifyName,
  makeBuyersphereLink,
})
