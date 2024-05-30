// This composable only returns a value when called from the client side

let heapLoading = false

export const useHeap = () => {
  if (!heapLoading) {
    heapLoading = true
    const { heap } = useAppConfig()
    useHead({
      script: [{ innerHTML: 
        `window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
        heap.load("${heap.id}");`
        }]
    })
  }

  // calls heap.identify(id) and heap.addUserProperties(props)
  function identify(id, props) {
    if (!process.client) {
      return;
    }

    if (window?.heap?.loaded) {
      window.heap.identify(id)
      heap.addUserProperties(props)
    } else {
      setTimeout(() => {
        identify(id, props)
      }, 1000)
    }
  }

  return {
    identify,
  }
}
