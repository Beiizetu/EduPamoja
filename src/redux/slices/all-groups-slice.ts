import { createSlice } from "@reduxjs/toolkit"
import { Group } from "@prisma/client"

interface AllGroupsState {
  groups: Group[]
  loading: boolean
  error: string | null
}

const initialState: AllGroupsState = {
  groups: [],
  loading: false,
  error: null
}

export const allGroupsSlice = createSlice({
  name: "allGroups",
  initialState,
  reducers: {
    setAllGroups: (state, action) => {
      state.groups = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const { setAllGroups, setLoading, setError } = allGroupsSlice.actions
export default allGroupsSlice.reducer