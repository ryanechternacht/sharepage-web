export default defineAppConfig({
  stytch: {
    baseUrl: "https://api.stytch.com",
    publicToken: "public-token-live-8c2b086c-f622-4dbe-8a04-5b623bad9300",
    redirectUri: "https://app.api.thebuyersphere.com/v0.1/login",
  },
  heap: {
    id: 3969496045,
  },
  featureFlags: {
    salesforce: false,
  },
  cookies: {
    domain: '.thebuyersphere.com'
  }
})
