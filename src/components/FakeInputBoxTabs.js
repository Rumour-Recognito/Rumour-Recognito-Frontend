import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import FeedIcon from '@mui/icons-material/Feed'
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';
import FakeInputForm from './FakeInputForm'
import Result from './Result'
import TabPanel from './TabPanel'
import axios from 'axios'

//var base_url = "http://localhost:5000"
var base_url = "https://rumor-recognito-backend.herokuapp.com"

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
      labels: ['Facebook', 'Twitter', 'Normal News', 'Image Analysis'],
      inputTypes: ['text', 'text', 'text', 'file'],
      adorement: [
        'https://www.facebook.com/.../posts/',
        'https://twitter.com/.../status/',
        '',
        ''
      ],
      placeholder: [
        'Paste only the post-id number',
        'Paste only the post-id number',
        'Type the news here',
        'Choose your image file (jpeg, jpg or png)'
      ],
      searchInputs: ['', '', '', ''],
      file: null,
      fileUrl: null,
      output: ['', '', '', '']
    }
  }

  //control the Input-box
  handleSearchInput = (event) => {
    var newSearchInputs = this.state.searchInputs
    newSearchInputs[this.state.tabValue] = event.target.value
    this.setState({
      searchInputs: newSearchInputs
    })
    if(this.state.tabValue == 3) {
      this.setState({
        file: event.target.files[0],
        fileUrl: URL.createObjectURL(event.target.files[0])
      })
    }
  }

  analyseFacebookPost = async (postUrl) => {
    var executed = false
    var response_got = null
    axios
      .post(base_url + '/facebook-scrape', {
        link: postUrl
      })
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
        const response = await axios.get(base_url + '/status')
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseTwitterPost = async (postUrl) => {
    var executed = false
    var response_got = null
    axios
      .post(base_url + '/tweet-scrape', {
        link: postUrl
      })
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
        const response = await axios.get(base_url + '/status')
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
      .get(base_url + '/plain-text?text=' + news)
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
        const response = await axios.get(base_url + '/status')
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseImage = async (imageFile) => {
    var executed = false
    var response_got = null
    const formData = new FormData();
    formData.append('file', imageFile);
    axios
      .post(base_url + '/analyze-image', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
        const response = await axios.get(base_url + '/status')
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
      verdict = await this.analyseFacebookPost(postText)
    } else if (tab === 1) {
      //analyse twitter post
      verdict = await this.analyseTwitterPost(postText)
    } else if (tab === 2) {
      //analyse normal news

      verdict = await this.analyseNormalNews(postText)
    } else {
      var imageFile = this.state.file
      verdict = await this.analyseImage(imageFile)
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

            <Tab
              icon={<ImageSearchTwoToneIcon />}
              label={this.state.labels[3]}
              {...a11yProps(3)}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <div>
          <TabPanel value={this.state.tabValue} index={0}>
            <FakeInputForm
              id={0}
              label={this.state.labels[0]}
              inputType={this.state.inputTypes[0]}
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
              inputType={this.state.inputTypes[1]}
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
              inputType={this.state.inputTypes[2]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[2]}
              handleSubmit={this.handleSubmit}
              adorement={this.state.adorement[2]}
              placeholder={this.state.placeholder[2]}
            />
            <p className="mt-5">{this.state.output[2]}</p>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={3}>
            <FakeInputForm
              id={3}
              label={this.state.labels[3]}
              inputType={this.state.inputTypes[3]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[3]}
              handleSubmit={this.handleSubmit}
              adorement={this.state.adorement[3]}
              placeholder={this.state.placeholder[3]}
            />
            <img src={this.state.fileUrl} style={{width: 150, height: 100, marginTop: '10px'}}/>
            <p className="mt-5">{this.state.output[3]}</p>
          </TabPanel>
        </div>
      </Box>
    )
  }
}

export default FakeInputBoxTabs
