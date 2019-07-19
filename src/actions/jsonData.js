import storage from 'electron-json-storage'
import { createAction } from 'redux-actions'

// const setJson = createAction('SET_JSONDATA')

export function setJsonData(json = '') {
  storage.set('jsonData', json)
}

export function loadJasonData(jsonData) {
  return storage.get('jsonData')
}

// export function saveSettings() {
//   return (dispatch, getState) => {
//     // prevent blocking the main thread
//     // for no reason
//     window.requestIdleCallback(() => {
//       const state = getState()
//       const jsonData = state.jsonData.toJS()
//       dispatch({
//         type: 'SAVE_JSONDATA',
//         payload: jsonData,
//       })
//       storage.set('jsonData', jsonData)
//     })
//   }
// }


