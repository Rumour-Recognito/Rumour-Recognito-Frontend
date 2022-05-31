import React from 'react'
import brand_logo from '../images/brand_logo.png'
import FakeInputBoxTabs from './FakeInputBoxTabs'

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="body">
          <header className="header">
            <img src={brand_logo} width="280px" height="120px" />
          </header>
          <div className="fakeinput-container">
            <FakeInputBoxTabs />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Home
