// designed just for old pages that I want to keep the code around
// defensively (or while porting), but don't want to ever be shown

export default defineNuxtRouteMiddleware(async (to, _) => {
  return navigateTo('/login')
})