import DropdownMenu from 'v-dropdown-menu'
import 'v-dropdown-menu/css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DropdownMenu)
})
