import React from 'react'
import SearchContainer from './components/search/SearchContainer'
import {Button} from 'antd'
import 'antd/dist/antd.css'
import overlay from './components/overlay'
export default function App() {
  return (
    <div>
      hello word
      <SearchContainer>
        <Button onClick={() => overlay.showForm(null)}></Button>
      </SearchContainer>
    </div>
  )
}
