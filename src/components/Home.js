import React from 'react'
import FakeInputBoxTabs from './FakeInputBoxTabs'

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="body">
          <header className="header">
            <h1>Rumour Recognito</h1>
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
