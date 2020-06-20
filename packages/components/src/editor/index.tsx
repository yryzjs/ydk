import React from 'react'
import AceEditor, {IAceEditorProps} from 'react-ace'

import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-monokai'

const Editor: React.FC<IAceEditorProps> = ({
  mode = 'yaml',
  theme = 'monokai',
  ...props
}) => {
  return (
    <AceEditor
      mode={mode}
      theme={theme}
      height="300px"
      fontSize={16}
      width="600px"
      editorProps={{$blockScrolling: true}}
      {...props}
    />
  )
}
export default Editor
