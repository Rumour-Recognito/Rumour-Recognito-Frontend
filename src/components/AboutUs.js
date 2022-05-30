import React from 'react'
import Person_data from '../data/AboutUs.json'
import IconButton from '@mui/material/IconButton'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'

export default class About extends React.Component {
  constructor(props) {
    super(props)
    this.person_data = Person_data
  }

  handleRedirect = (link) => {
    window.location(link)
  }

  render() {
    return (
      <div className="about-body">
        <section className="grid">
          {this.person_data.map((item) => {
            return <Person person={item} key={item.id} />
          })}
        </section>
      </div>
    )
  }
}

class Person extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="designPerson" id="">
          <img src={this.props.person.img} className="designimg" alt="" />
          <div className="about-name">
            <p>{this.props.person.name}</p>
          </div>
          <div>
            <Mail />
            <LinkedIn />
            <Github />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

class Mail extends React.Component {
  render() {
    return (
      <>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <EmailIcon style={{ color: '#E60000' }} />
          </IconButton>
        </label>
      </>
    )
  }
}

class LinkedIn extends React.Component {
  render() {
    return (
      <>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <LinkedInIcon />
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
            aria-label="upload picture"
            component="span"
          >
            <GitHubIcon style={{ color: 'black' }} />
          </IconButton>
        </label>
      </>
    )
  }
}
