import { fsReadFile } from 'helpers/fs'

const { dialog } = require('electron').remote

dialog.showOpenDialog({}, files => {
  if (files && files.length > 0) {
    fsReadFile(files[0], 'utf8', (err, res) => {
      if (!err) {
        // editorGlobal.setModel(monacoGlobal.editor.createModel(res, 'javascript'));
        console.log('json', res)
        const loadNotification = new Notification('NL JSON - Load', {
          body: 'Json Chargé',
        })
      }
    })
  }
})
