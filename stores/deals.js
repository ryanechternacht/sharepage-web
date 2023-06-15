import { defineStore } from 'pinia'

const deals = {
  0: {
    id: 0,
    name: 'Bank of America',
    status: 'Active',
    logo: '/svg/boa.svg',
    customerTeam: [{
      name: 'Walter White',
      title: 'Account Executive',
      linkedIn: 'https://google.com'
    }, {
      name: 'Cara Winslow',
      title: 'Partnerships Manager',
      linkedIn: 'https://google.com'
    }, {
      name: 'Jack Gopher',
      title: 'Marketing Expert',
    }, {
      name: 'Gary Busy',
      title: 'Product Expert',
      linkedIn: 'https://google.com'
    }],
    ourTeam: [{
      name: 'Rebekah Black',
      title: 'Account Executive',
      linkedIn: 'https://google.com'
    }, {
      name: 'Carrot Toppe',
      title: 'Partnerships Manager',
      linkedIn: 'https://google.com'
    }, {
      name: 'Jeremy Hunt',
      title: 'Marketing Expert',
      linkedIn: 'https://google.com'
    }, {
      name: 'Gabriella Lopez',
      title: 'Product Expert',
    }],
    partners: [{
      name: 'Seismic',
      logo: '/svg/seismic.svg',
      team: [{
        name: 'Walter White',
        title: 'Account Executive',
        linkedIn: 'https://google.com'
      }, {
        name: 'Cara Winslow',
        title: 'Partnerships Manager',
        linkedIn: 'https://google.com'
      }, {
        name: 'Jack Gopher',
        title: 'Marketing Expert',
        linkedIn: 'https://google.com'
      }, {
        name: 'Gary Busy',
        title: 'Product Expert',
      }]
    }]
  }
}

export const useDealsStore = defineStore('deals', {
  state: () => ({ deals }),
  getters: {
    getById: (state) => (id) => state.deals[id]
  }
})
