export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://test.stytch.com",
    publicToken: "public-token-test-3d685515-f94a-4444-96f6-fd54e4d4c1e2",
    redirectUri: "https://app.api.swaypage-dev.io/v0.1/login",
  },
  heap: {
    id: 3326826010,
  },
  hotjar: {
    id: 5113914,
  },
  featureFlags: {
    salesforce: true,
  },
  cookies: {
    domain: '.swaypage-dev.io'
  },
})
