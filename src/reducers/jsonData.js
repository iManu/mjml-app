import { handleActions } from 'redux-actions'

export default handleActions(
  {
    SET_JSONDATA: (state, { payload }) => payload,
  },
  null,
)
