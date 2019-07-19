import path from 'path'
import { createAction } from 'redux-actions'

import mjml2html from 'helpers/mjml'
import { fsReadFile } from 'helpers/fs'
import { updateProjectPreview } from 'actions/projects'
import parseVars from 'helpers/parseVars'
// import { loadJsonData } from 'actions/jsonData'

// import storage from 'electron-json-storage'

let userVars

const setPrev = createAction('SET_PREVIEW')

export function setPreview(fileName, content = '') {
  return async (dispatch, getState) => {
    if (!fileName) {
      return dispatch(setPrev(null))
    }
    
    const bName = path.basename(fileName)
    const fName = path.dirname(fileName)
    const ext = path.extname(fileName)
    
    const state = getState()
    const { settings } = state
    
    // const jsonData = storage.get('jsonData')
    // console.log('loadJsonData', jsonData)
    // const userVars = {}
    // if(!userVars) {
    //   userVars = state.
    // }
    // eventually get the custom mjml path set in settings
    const mjmlManual = settings.getIn(['mjml', 'engine']) === 'manual'
    const mjmlPath = mjmlManual ? settings.getIn(['mjml', 'path']) : undefined


    
    switch (ext) {
      case '.html': // eslint-disable-line no-case-declarations
        if (!content) {
          content = await fsReadFile(fileName, { encoding: 'utf8' })
        }
        // console.log('loadJsonData lol', jsonData)

        userVars = JSON.parse(window.localStorage.getItem('jsonData'))[0]

        const finalcontent = parseVars(content, userVars)
        dispatch(setPrev({ type: 'html', finalcontent }))
        break
      case '.jpg':
      case '.png':
      case '.gif':
        dispatch(setPrev({ type: 'image', content: fileName }))
        break
      case '.mjml': // eslint-disable-line no-case-declarations
        if (!content) {
          content = await fsReadFile(fileName, { encoding: 'utf8' })
        }
        const renderOpts = {
          minify: settings.getIn(['mjml', 'minify']),
        }
        const { html, errors } = await mjml2html(content, fileName, mjmlPath, renderOpts)

        userVars = JSON.parse(window.localStorage.getItem('jsonData'))[0]

        const final = parseVars(html, userVars)

        dispatch(setPrev({ type: 'html', content: final, errors }))
        // update the preview in project
        if (bName === 'index.mjml') {
          dispatch(updateProjectPreview(fName, html))
        }
        break
      default:
        dispatch(setPrev(null))
    }
  }
}
