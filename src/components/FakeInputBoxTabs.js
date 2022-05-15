import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import FeedIcon from '@mui/icons-material/Feed'
import FakeInputForm from './FakeInputForm'
import Result from './Result'
import TabPanel from './TabPanel'
import axios from 'axios'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

class FakeInputBoxTabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tabValue: 0,
      labels: ['Facebook', 'Twitter', 'Normal News'],
      adorement: [
        'https://www.facebook.com/.../posts/',
        'https://twitter.com/.../status/',
        ''
      ],
      placeholder: [
        'Paste only the post-id number',
        'Paste only the post-id number',
        'Type the news here'
      ],
      searchInputs: ['', '', ''],
      output: ['', '', '']
    }
  }

  //control the Input-box
  handleSearchInput = (event) => {
    var newSearchInputs = this.state.searchInputs
    newSearchInputs[this.state.tabValue] = event.target.value
    this.setState({
      searchInputs: newSearchInputs
    })
  }

  analyseFacebookPost = async (postId) => {
    var executed = false
    var response_got = null
    axios
      .get('http://localhost:5000/facebook-scrape?id=' + postId)
      .then(function (response) {
        // handle success
        response_got = response
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        executed = true
      })

    while (!executed) {
      try {
        const response = await axios.get('http://localhost:5000/status')
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseTwitterPost = async (postId) => {
    var executed = false
    var response_got = null
    axios
      .get('http://localhost:5000/tweet-scrape?id=' + postId)
      .then(function (response) {
        // handle success
        response_got = response
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        executed = true
      })

    while (!executed) {
      try {
        const response = await axios.get('http://localhost:5000/status')
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseNormalNews = async (news) => {
    var executed = false
    var response_got = null
    axios
      .get('http://localhost:5000/plain-text?text=' + news)
      .then(function (response) {
        // handle success
        response_got = response
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        executed = true
      })

    while (!executed) {
      try {
        const response = await axios.get('http://localhost:5000/status')
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  //On submit of the link
  handleSubmit = async (event) => {
    event.preventDefault()

    var tab = this.state.tabValue

    var postText = this.state.searchInputs[tab] //to get the input
    var verdict

    if (tab === 0) {
      //analyse facebook post

      var postId = postText
      var verdict = await this.analyseFacebookPost(postId)
    } else if (tab === 1) {
      //analyse twitter post

      var postId = postText
      var verdict = await this.analyseTwitterPost(postId)
    } else {
      //analyse normal news

      var verdict = await this.analyseNormalNews(postText)
    }

    alert(verdict.data)

    var newOutput = this.state.output
    newOutput[tab] = verdict.data
    this.setState({
      output: newOutput
    })
  }

  handleTabChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    })
  }

  render() {
    return (
      <Box sx={{ width: '75%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab
              icon={<FacebookIcon />}
              label={this.state.labels[0]}
              {...a11yProps(0)}
              iconPosition="start"
            />

            <Tab
              icon={<TwitterIcon />}
              label={this.state.labels[1]}
              {...a11yProps(1)}
              iconPosition="start"
            />

            <Tab
              icon={<FeedIcon />}
              label={this.state.labels[2]}
              {...a11yProps(2)}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <div>
          <TabPanel value={this.state.tabValue} index={0}>
            <FakeInputForm
              id={0}
              label={this.state.labels[0]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[0]}
              handleSubmit={this.handleSubmit}
              adorement={this.state.adorement[0]}
              placeholder={this.state.placeholder[0]}
            />
            <p className="mt-5">
              <Result />
            </p>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={1}>
            <FakeInputForm
              id={1}
              label={this.state.labels[1]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[1]}
              handleSubmit={this.handleSubmit}
              adorement={this.state.adorement[1]}
              placeholder={this.state.placeholder[1]}
            />
            <p className="mt-5">{this.state.output[1]}</p>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={2}>
            <FakeInputForm
              id={2}
              label={this.state.labels[2]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[2]}
              handleSubmit={this.handleSubmit}
              adorement={this.state.adorement[2]}
              placeholder={this.state.placeholder[2]}
            />
            <p className="mt-5">{this.state.output[2]}</p>
          </TabPanel>
        </div>
      </Box>
    )
  }
}

export default FakeInputBoxTabs
