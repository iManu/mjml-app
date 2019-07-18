import path from 'path'
import { createAction } from 'redux-actions'

import mjml2html from 'helpers/mjml'
import { fsReadFile } from 'helpers/fs'
import { updateProjectPreview } from 'actions/projects'
// import userVars from 'data/userVars'

let userVars
const { dialog } = require('electron').remote

dialog.showOpenDialog({}, files => {
  if (files && files.length > 0) {
    fsReadFile(files[0], 'utf8', (err, res) => {
      if (!err) {
        // editorGlobal.setModel(monacoGlobal.editor.createModel(res, 'javascript'));

        userVars = JSON.parse(res)[0]
        const loadNotification = new Notification('NL JSON - Load', {
          body: 'Json Chargé',
        })
      }
    })
  }
})
const setPrev = createAction('SET_PREVIEW')

function getValue(object, keys) {
  return keys.split('.').reduce((o, k) => {
    return (o || {})[k];
  }, object);
}

const parseVars = html => {
  return html.replace(/{([^}]*)}/g, (r,k)=>getValue(userVars, k))
}

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

    // eventually get the custom mjml path set in settings
    const mjmlManual = settings.getIn(['mjml', 'engine']) === 'manual'
    const mjmlPath = mjmlManual ? settings.getIn(['mjml', 'path']) : undefined

    switch (ext) {
      case '.html': // eslint-disable-line no-case-declarations
        if (!content) {
          content = await fsReadFile(fileName, { encoding: 'utf8' })
        }
        const finalcontent = parseVars(content)
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
        const final = parseVars(html)

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
