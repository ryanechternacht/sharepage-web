

let embedlyLoading = false

export const useEmbedly = () => {
  if (!embedlyLoading) {
    embedlyLoading = true
    useHead({
      script: [{ src: '//cdn.embedly.com/widgets/platform.js' }]
    })
  }

  // loads embedly into global scope
  return {
    embedly: process.client ? window?.embedly : () => { }
  }
}
