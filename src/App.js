import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import $ from 'jquery'

import Navbar from './components/Navbar'

class App extends React.Component {
  //defining the state variable

  render() {
    return (
      <React.Fragment>
        <div className="home-background">
          <div className="container fade50">
            <Navbar />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App
