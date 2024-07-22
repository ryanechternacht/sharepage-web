// const logo = computed(() => `https://logo.clearbit.com/${pageData.domain}`)

function makeClearbitLogo (domain) {
  return `https://logo.clearbit.com/${domain}`
}

export const useLogo = () => ({ 
  makeClearbitLogo,
})
