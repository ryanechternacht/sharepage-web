import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash';

// const deals = {
//   0: {
//     id: 0,
//     name: 'Bank of America',
//     status: 'Active',
//     logo: '/svg/boa.svg',
//     customerTeam: [{
//       name: 'Walter White',
//       title: 'Account Executive',
//       linkedIn: 'https://google.com'
//     }, {
//       name: 'Cara Winslow',
//       title: 'Partnerships Manager',
//       linkedIn: 'https://google.com'
//     }, {
//       name: 'Jack Gopher',
//       title: 'Marketing Expert',
//     }, {
//       name: 'Gary Busy',
//       title: 'Product Expert',
//       linkedIn: 'https://google.com'
//     }],
//     ourTeam: [{
//       name: 'Rebekah Black',
//       title: 'Account Executive',
//       linkedIn: 'https://google.com'
//     }, {
//       name: 'Carrot Toppe',
//       title: 'Partnerships Manager',
//       linkedIn: 'https://google.com'
//     }, {
//       name: 'Jeremy Hunt',
//       title: 'Marketing Expert',
//       linkedIn: 'https://google.com'
//     }, {
//       name: 'Gabriella Lopez',
//       title: 'Product Expert',
//     }],
//     partners: [{
//       name: 'Seismic',
//       logo: '/svg/seismic.svg',
//       team: [{
//         name: 'Walter White',
//         title: 'Account Executive',
//         linkedIn: 'https://google.com'
//       }, {
//         name: 'Cara Winslow',
//         title: 'Partnerships Manager',
//         linkedIn: 'https://google.com'
//       }, {
//         name: 'Jack Gopher',
//         title: 'Marketing Expert',
//         linkedIn: 'https://google.com'
//       }, {
//         name: 'Gary Busy',
//         title: 'Product Expert',
//       }]
//     }],
//     overview: {
//       sections: [{
//         prompt: '🧙‍♀️ Why we think we\'re better together',
//         type: 'text',
//         answer:
//           `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed 
//            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//            Massa placerat duis ultricies lacus sed turpis tincidunt id 
//            aliquet. Diam in arcu cursus euismod quis viverra nibh.`
//       }, {
//         prompt: '🐙 The pain points we\'re solving for',
//         type: 'text',
//         answer:
//           `Eget duis at tellus at. Amet mauris commodo quis imperdiet. 
//            Non odio euismod lacinia at quis risus sed vulputate odio. Ut
//            eu sem integer vitae justo. Urna duis convallis convallis 
//            tellus id interdum. Pellentesque sit amet porttitor eget 
//            dolor morbi.`
    
//       }, {
//         prompt: '🤖 How our tools solve against your paint points',
//         type: 'text',
//         answer:
//           `Enim nec dui nunc mattis enim ut. Massa placerat duis
//            ultricies lacus sed turpis tincidunt id. Orci phasellus 
//            egestas tellus rutrum tellus pellentesque eu tincidunt. Vitae
//            congue mauris rhoncus aenean vel. Ac turpis egestas maecenas
//            pharetra convallis posuere.`
    
//       }, {
//         prompt: '🔌 How our integration works',
//         type: 'text',
//         answer:
//           `Ac tincidunt vitae semper quis. Tincidunt praesent semper 
//            feugiat nibh sed. Sed felis eget velit aliquet sagittis id.
//            Cum sociis natoque penatibus et. A diam sollicitudin tempor
//            id eu nisl nunc.`
      
//       }, {
//         prompt: '📓 Hand-picked resources',
//         type: 'list',
//         answers: [
//           'Sodales neque sodales ut etiam sit amet', 
//           'Et odio pellentesque diam volutpat commodo. Et odio pellentesque diam volutpat commodo. Et odio pellentesque diam volutpat commodo.', 
//           'Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Viverra aliquet eget sit amet tellus cras adipiscing enim eu.'
//         ]
//       }]
//     }
//   }
// }


export const useBuyerspheresStore = defineStore('buyerspheres', {
  state: () => ({ buyerspheres: {} }),
  getters: {
    getById: (state) => (id) => state.buyerspheres[id]
  },
  actions: {
    save(buyersphere) {
      // TODO call out to a backend
      this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    },
    async savefeaturesAnswer({ buyersphereId, featuresAnswer }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/features`,
        { method: 'PATCH', body: featuresAnswer }
      )
      this.buyerspheres[buyersphereId] = data
    },
    async fetchOrbit({ buyersphereId }) {
      // TODO support force refresh
      // TODO support urls file?
      // TODO support more stuff better?
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`
      )

      this.buyerspheres[buyersphereId] = data
    }
  }
})
