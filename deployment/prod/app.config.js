export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://api.stytch.sharepage.io",
    publicToken: "public-token-live-8c2b086c-f622-4dbe-8a04-5b623bad9300",
    redirectUri: "https://app.api.sharepage.io/v0.1/login",
  },
  heap: {
    id: 3969496045,
  },
  hotjar: {
    id: 5113773,
  },
  featureFlags: {
    salesforce: false,
  },
  cookies: {
    domain: '.sharepage.io'
  }
})
