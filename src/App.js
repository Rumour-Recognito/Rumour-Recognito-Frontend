import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import $ from 'jquery'

import Home from './components/Home'

class App extends React.Component {
  //defining the state variable

  render() {
    return (
      <React.Fragment>
        <Home />
      </React.Fragment>
    )
  }
}

export default App
