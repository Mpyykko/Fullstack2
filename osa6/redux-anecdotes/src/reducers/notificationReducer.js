import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      console.log('Tuliko ilmoitus?', action.payload)
      return action.payload
    },
    clearNotification() {
      console.log('Poistuiko ilmoitus?')
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer