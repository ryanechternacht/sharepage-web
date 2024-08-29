// This composable only returns a value when called from the client side

let hotjarLoading = false

export const useHotjar = () => {
  if (!hotjarLoading) {
    hotjarLoading = true
    const { hotjar } = useAppConfig()
    useHead({
      script: [{ innerHTML: 
        `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjar.id},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
      }]
    })
  }
}
