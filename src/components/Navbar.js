import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch
} from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import GroupsIcon from '@mui/icons-material/Groups'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Home from './Home'
import Aboutus from './AboutUs'
import brand from '../images/navbar_brand_name.png'

class Navbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 0
    }
  }

  handleClick = (newTab) => {
    this.setState({
      activeTab: newTab
    })
  }

  componentDidMount() {
    var pathname = window.location.pathname
    if (pathname !== '/') {
      this.setState({
        activeTab: 1
      })
    }
  }

  render() {
    return (
      <>
        <div>
          <Router>
            <div className="navbar navbar-header">
              <div className="navbar-brand">
                <NavLink
                  to="/"
                  className="nav-link"
                  onClick={() => {
                    this.handleClick(0)
                  }}
                >
                  <img src={brand} width="210px" height="55px" />
                </NavLink>
              </div>
              <div className="navbar-nav nav-flex">
                <div className="nav-item">
                  <NavLink
                    to="/"
                    className="nav-link"
                    onClick={() => {
                      this.handleClick(0)
                    }}
                  >
                    <Tab
                      icon={<HomeIcon />}
                      label="Home"
                      style={{
                        color: this.state.activeTab == 0 ? '#1976d2' : 'black',
                        borderRadius: '35%'
                      }}
                    />
                  </NavLink>
                </div>
                <div className="nav-item">
                  <NavLink
                    to="/about-us"
                    className="nav-link"
                    onClick={() => {
                      this.handleClick(1)
                    }}
                  >
                    <Tab
                      icon={<GroupsIcon />}
                      label="About Us"
                      style={{
                        color: this.state.activeTab == 1 ? '#1976d2' : 'black',
                        borderRadius: '35%'
                      }}
                    />
                  </NavLink>
                </div>
              </div>
            </div>
            <div>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/about-us">
                  <Aboutus />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </>
    )
  }
}

export default Navbar
