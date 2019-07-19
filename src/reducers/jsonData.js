import { handleActions } from 'redux-actions'

const state = null

export default handleActions(
  {
    SET_JSONDATA: (state, { payload }) => state.update('jsonData', payload),
    JSONDATA_LOAD: (state, { payload }) => {
      return payload
    },
  },
  state,
)
