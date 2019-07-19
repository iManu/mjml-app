import { createAction } from 'redux-actions'

const setJson = createAction('SET_JSONDATA')

export function setJsonData(json = '') {
  // return async (dispatch) => {
    
  //   dispatch(setPrev(json))
  // }
  setJson(json)
}
