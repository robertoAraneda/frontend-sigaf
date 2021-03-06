import axios from '../../services/axios'

const BASE_URL = '/api/v2/tickets'

export default {
  namespaced: true,
  state: {
    tickets: [],
    ticket: null,
    ticketDetails: [],
    manageTickets: []
  },
  mutations: {
    SET_TICKETS: (state, tickets) => {
      state.tickets = tickets
    },
    SET_TICKET: (state, ticket) => {
      state.ticket = ticket
    },
    SET_MANAGE_TICKET: (state, ticket) => {
      state.manageTickets = ticket
    },
    SET_TICKET_DETAILS: (state, ticketDetails) => {
      state.ticketDetails = ticketDetails
    },
    POST_TICKET: (state, ticket) => {
      state.tickets.unshift(ticket)
    },
    PUT_TICKET: (state, ticket) => {
      const editedIndex = state.tickets.findIndex(
        find => find.properties.id === ticket.properties.id
      )
      if (editedIndex !== -1) {
        Object.assign(state.tickets[editedIndex], ticket)
      }
    },
    DELETE_TICKET: (state, ticket) => {
      const editedIndex = state.tickets.findIndex(find => {
        return find.properties.id === ticket.id
      })
      state.tickets.splice(editedIndex, 1)
    }
  },
  getters: {
    tickets: (state, getters, rootState, rootGetters) => {
      return state.tickets.map(ticket => {
        if (rootState.auth.loginUser !== null) {
          if (ticket.relationships.numberOfElements === 0) {
            if (ticket.properties.statusTicket.description === 'Abierto') {
              console.log(rootGetters)
              if (
                ticket.properties.userCreated.id ===
                  rootState.auth.loginUser.id ||
                rootGetters['auth/isAdmin'] ||
                rootGetters['auth/isDeveloper']
              ) {
                return Object.assign(ticket, {
                  showDeleteButton: true,
                  close: false
                })
              } else {
                return Object.assign(ticket, {
                  showDeleteButton: false,
                  close: false
                })
              }
            } else {
              if (
                ticket.properties.userCreated.id ===
                  rootState.auth.loginUser.id ||
                rootGetters['auth/isAdmin'] ||
                rootGetters['auth/isDeveloper']
              ) {
                return Object.assign(ticket, {
                  showDeleteButton: true,
                  close: true
                })
              } else {
                return Object.assign(ticket, {
                  showDeleteButton: false,
                  close: true
                })
              }
            }
          } else {
            if (ticket.properties.statusTicket.description === 'Abierto') {
              return Object.assign(ticket, {
                showDeleteButton: false,
                close: false
              })
            } else {
              return Object.assign(ticket, {
                showDeleteButton: false,
                close: true
              })
            }
          }
        } else {
          return []
        }
      })
    },
    ticketsByCourse: state => {
      return state.tickets.reduce((accumulator, object) => {
        let key = object.properties.courseRegisteredUser.course.category_id
        if (!accumulator[key]) {
          accumulator[key] = []
        }
        accumulator[key].push(object)
        return accumulator
      }, {})
    },
    ticket: state => {
      return state.ticket
    },
    ticketDetailsByTicket: state => {
      return state.ticketDetails.map(({ properties }) => {
        return properties
      })
    },
    getLastTicket: state => {
      return state.tickets[state.tickets.length - 1]
    },
    getStatusTicket: state => {
      return state.tickets.reduce(function(accumulator, object) {
        let key = object.properties.statusTicket.description
        if (!accumulator[key]) {
          accumulator[key] = []
        }
        accumulator[key].push(object)
        return accumulator
      }, {})
    },
    getManageTicket: state => state.manageTickets
  },
  actions: {
    fetchTicketDetails: async ({ commit }, ticket) => {
      const response = await axios.get(
        `${BASE_URL}/${ticket.id}/ticket-details`
      )
      const { _data, success, error, message } = response.data

      if (success) {
        commit('SET_TICKET_DETAILS', _data.relationships.collection.data)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },

    findTicketDetailByTicket: async (_, url) => {
      try {
        const { data, status } = await axios.get(url)
        if (status === 200) {
          return data
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    findTicketByCourse: async ({ commit }, course) => {
      const response = await axios.get(
        `${BASE_URL}/course-registered-users/course/${course.id}`
      )
      commit('SET_TICKETS', response.data._data.collections)
      return response.data
    },
    findTicket: async ({ commit }, ticket) => {
      const response = await axios.get(`${BASE_URL}/${ticket.id}`)

      const { _data, success, error, message } = response.data

      console.log('ticketvuex', _data)

      if (success) {
        commit('SET_TICKET', _data)

        return { success, error, message, _data }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    findTicketByCode: async ({ commit }, code) => {
      commit('SET_MANAGE_TICKET', [])
      const response = await axios.get(`${BASE_URL}/code/${code}`)

      const { _data, success, error, message } = response.data

      if (success) {
        commit('SET_MANAGE_TICKET', _data)

        return { success, error, message, _data }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    findTicketByOperator: async ({ commit }, operator) => {
      commit('SET_MANAGE_TICKET', [])
      const response = await axios.get(`${BASE_URL}/operator/${operator}`)

      const { _data, success, error, message } = response.data

      if (success) {
        commit('SET_MANAGE_TICKET', _data)

        return { success, error, message, _data }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    findTicketByRangeOfDates: async ({ commit }, rangeOfDates) => {
      commit('SET_MANAGE_TICKET', [])
      const response = await axios.get(
        `${BASE_URL}/dates/${rangeOfDates[0]}/${rangeOfDates[1]}`
      )

      const { _data, success, error, message } = response.data

      if (success) {
        commit('SET_MANAGE_TICKET', _data)

        return { success, error, message, _data }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    fetchTickets: async ({ commit }) => {
      const response = await axios.get(BASE_URL)

      const { _data, success, error, message } = response.data

      if (success) {
        commit('SET_TICKETS', _data.collections)

        return { success, error, message }
      } else {
        console.log(error)
        return { success, error, message }
      }
    },
    putTicket: async ({ commit }, ticket) => {
      try {
        console.log('ticket', ticket)
        const { data, status } = await axios.put(
          `${BASE_URL}/${ticket.ticket_id}`,
          ticket
        )
        if (status === 200) {
          const { _data, success, error, message } = data

          if (success) {
            commit('PUT_TICKET', _data)
          } else {
            console.log(error)
          }

          return { success, message, _data }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postTicket: async ({ commit }, ticket) => {
      try {
        const { data } = await axios.post(BASE_URL, ticket)

        const { _data, success, error, message } = data

        if (success) {
          commit('POST_TICKET', _data)
        } else {
          console.log(error)
        }

        return { success, message, _data }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteTicket: async ({ commit }, ticket) => {
      try {
        const { status, data } = await axios.delete(`${BASE_URL}/${ticket.id}`)

        if (status === 200) {
          const { success, error, message } = data

          if (success) {
            commit('DELETE_TICKET', ticket)
          } else {
            console.log(error)
          }

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteMultipleTicket: async (_, tickets) => {
      try {
        let ids = JSON.stringify(tickets)
        const { status, data } = await axios.delete(
          `${BASE_URL}/multiple/${ids}`
        )

        if (status === 200) {
          const { success, message } = data

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    clearDetailTickets: ({ commit }) => {
      commit('SET_TICKET_DETAILS', [])
    },

    postMultipleTicket: async ({ commit }, payload) => {
      try {
        const { data } = await axios.post('/api/v2/tickets/multiple', payload)

        const { _data, success, error } = data

        if (success) {
          for (let index = 0; index < _data.length; index++) {
            commit('POST_TICKET', _data[index])
          }
          return { _data, success }
        } else {
          console.log(error)
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postMailMultipleTicket: async (_, payload) => {
      try {
        const data = await axios.post('/api/v2/mail/massive', payload)

        const { _data, success, error } = data

        if (success) {
          console.log(_data)
          return { _data, success }
        } else {
          console.log(error)
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    deleteFileEmail: async (_, payload) => {
      try {
        const { data } = await axios.post('/api/v2/mail/delete/file', payload)

        const { _data } = data

        return _data
      } catch (error) {
        console.log(error)
      }
    },
    uploadFileEmail: async (_, payload) => {
      try {
        let formData = new FormData()

        formData.append(`file`, payload.file)

        const config = {
          'Content-Type': 'multipart/form-data'
        }
        const { data } = await axios.post(
          '/api/v2/mail/upload/file',
          formData,
          config
        )

        const { _data } = data

        return _data
      } catch (error) {
        console.log(error)
      }
    },
    postMailTicket: async (_, payload) => {
      try {
        const { data } = await axios.post('/api/v2/mail/single', payload)

        console.log(data)
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    postMailTicket_: async (_, payload) => {
      try {
        let data
        if (payload.files) {
          let formData = new FormData()

          payload.files.forEach((file, index) => {
            formData.append(`file_${index}`, file)
          })

          formData.append('text', payload.text)
          formData.append('ticketId', payload.ticketId)
          formData.append('numberOfFiles', payload.files.length)
          formData.append('subject', payload.subject)

          const config = {
            'Content-Type': 'multipart/form-data'
          }
          data = await axios.post('/api/v2/mail/single', formData, config)
        } else {
          data = await axios.post('/api/v2/mail/single', payload)
        }

        console.log(data)

        const { _data, success, error } = data

        if (success) {
          console.log(_data)
          return { _data, success }
        } else {
          console.log(error)
        }
      } catch (error) {
        const { data } = error.response
        return {
          success: data.success,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    },
    findTicketByUser: async (_, payload) => {
      try {
        const { status, data } = await axios.get(
          `/api/v2/course-registered-user/${payload.id}/tickets`
        )

        if (status === 200) {
          const { success, error, message, _data } = data

          if (success) {
            return _data.collections
          } else {
            console.log(error)
          }

          return { success, message }
        } else {
          return {
            success: data.success,
            error: 'No se ha podido realizar la operación'
          }
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          error: 'Error grave. Contacte al Administrador.'
        }
      }
    }
  }
}
