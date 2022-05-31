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

  render() {
    return (
      <div className="about-body">
        <div>
          <h1 className="design-about-header">Team Squadra</h1>
        </div>
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

  handleRedirect = (link) => {
    window.open(link, '_blank')
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="designPerson"
          id=""
          style={{
            marginTop: this.props.person.id % 2 == 0 ? '10px' : '120px'
          }}
        >
          <img src={this.props.person.img} className="designimg" alt="" />
          <div className="about-name">
            <p>{this.props.person.name}</p>
          </div>
          <div>
            <Mail
              link={this.props.person.mail}
              handleRedirect={this.handleRedirect}
            />
            <LinkedIn
              link={this.props.person.linkedIn}
              handleRedirect={this.handleRedirect}
            />
            <Github
              link={this.props.person.github}
              handleRedirect={this.handleRedirect}
            />
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
            aria-label="developer contact-mail"
            component="span"
            onClick={() => {
              this.props.handleRedirect(this.props.link)
            }}
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
            aria-label="linkedIn Profile"
            component="span"
            onClick={() => {
              this.props.handleRedirect(this.props.link)
            }}
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
            aria-label="github profile"
            component="span"
            onClick={() => {
              this.props.handleRedirect(this.props.link)
            }}
          >
            <GitHubIcon style={{ color: 'black' }} />
          </IconButton>
        </label>
      </>
    )
  }
}
