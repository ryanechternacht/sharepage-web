function convertPageData(pageData) {
  const obj = {
    email: pageData.email,
    'first-name': pageData.firstName,
    'last-name': pageData.lastName,
    domain: pageData.domain,
    'account-name': pageData.accountName,
    ai: pageData.ai,
  }

  let i = 1
  while (pageData['field' + i]) {
    obj['field-' + i] = pageData['field' + i]
    i++
  }

  return obj
}

export const usePageData = () => ({ 
  convertPageData,
})
