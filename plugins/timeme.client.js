import timeMe from 'timeme.js/timeme.min';

timeMe.initialize({
  idleTimeoutInSeconds: 5, // stop recording time due to inactivity
  //websocketOptions: { // optional
  //	websocketHost: "ws://your_host:your_port",
  //	appId: "insert-your-made-up-app-id"
  //}
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.timeMe = timeMe
})
