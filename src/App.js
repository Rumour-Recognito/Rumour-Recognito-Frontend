import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import footer_brand_logo from './images/footer_brand_logo.png'

import Navbar from './components/Navbar'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'

class App extends React.Component {
  //defining the state variable

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 0
    }
  }

  componentDidMount() {
    var pathname = window.location.pathname
    if (pathname !== '/') {
      if (this.state.activeTab === 0) {
        this.setState({
          activeTab: 1
        })
      }
    } else {
      if (this.state.activeTab === 1) {
        this.setState({
          activeTab: 0
        })
      }
    }
  }

  handleClick = (event) => {
    var pathname = window.location.pathname
    if (pathname !== '/') {
      if (this.state.activeTab === 0) {
        this.setState({
          activeTab: 1
        })
      }
    } else {
      if (this.state.activeTab === 1) {
        this.setState({
          activeTab: 0
        })
      }
    }
  }

  handleRedirect = (link) => {
    window.open(link, '_blank')
  }

  render() {
    return (
      <React.Fragment>
        <div className="home-background">
          <div className="container fade50" onClick={this.handleClick}>
            <Navbar />
          </div>
        </div>
        {this.state.activeTab === 1 ? (
          <footer className="about-footer">
            <img
              src={footer_brand_logo}
              width="140px"
              height="60px"
              style={{ marginRight: '20px' }}
            />
            <div style={{ display: 'inline' }}>
              <Mail
                link={'mailto:team4squadra@gmail.com'}
                handleRedirect={this.handleRedirect}
              />
              <Github
                link={'https://github.com/Rumour-Recognito'}
                handleRedirect={this.handleRedirect}
              />
            </div>
          </footer>
        ) : null}
      </React.Fragment>
    )
  }
}

export default App

class Mail extends React.Component {
  render() {
    return (
      <>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="developer contact-mail"
            component="span"
            onClick={() => {
              this.props.handleRedirect(this.props.link)
            }}
            style={{ marginRight: '20px' }}
          >
            <EmailIcon style={{ color: '#E60000' }} fontSize="large" />
          </IconButton>
        </label>
      </>
    )
  }
}

class Github extends React.Component {
  render() {
    return (
      <>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="github profile"
            component="span"
            onClick={() => {
              this.props.handleRedirect(this.props.link)
            }}
          >
            <GitHubIcon style={{ color: 'white' }} fontSize="large" />
          </IconButton>
        </label>
      </>
    )
  }
}
