import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import FeedIcon from '@mui/icons-material/Feed'
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone'
import Button from '@mui/material/Button'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import FakeInputForm from './FakeInputForm'
import Result from './Result'
import Progress from './Progress'
import TabPanel from './TabPanel'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/material/styles'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

var base_url = ''
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  base_url = 'http://localhost:5000'
else base_url = 'https://rumor-recognito-backend.herokuapp.com'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

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
      phase: [0, 0, 0, 0],
      status: [-1, -1, -1, -1],
      jobId: [null, null, null, null],
      progressSteps: [
        [
          'Scrapping Facebook Data',
          'Processing Facebook Data',
          'Translation in Progress',
          'Populating Knowledge-Base',
          'Predicting News Veracity'
        ],
        [
          'Scrapping Twitter Data',
          'Processing Twitter Data',
          'Translation in Progress',
          'Populating Knowledge-Base',
          'Predicting News Veracity'
        ],
        [
          'Analyzing Text',
          'Processing Text Data',
          'Translation in Progress',
          'Populating Knowledge-Base',
          'Predicting News Veracity'
        ],
        [
          'Analyzing Image',
          'Processing Image Data',
          'Translation in Progress',
          'Populating Knowledge-Base',
          'Predicting News Veracity'
        ]
      ],
      labels: ['Facebook', 'Twitter', 'Normal News', 'Image Analysis'],
      inputTypes: ['text', 'text', 'text', 'file'],
      adorement: [
        'https://www.facebook.com/.../posts/',
        'https://twitter.com/.../status/',
        '',
        ''
      ],
      placeholder: [
        'Paste the facebook post-url of the news',
        'Paste the twitter post-url of the news',
        'Type the news here',
        'Choose your image file (jpeg, jpg or png)'
      ],
      searchInputs: ['', '', '', ''],
      file: null,
      fileUrl: null,
      output: ['', '', '', ''],
      isListening: false
    }

    //don't perform any operation on mic click.
    //block the mic to handle setState operation
    this.micIsBlocked = false
  }

  componentDidMount() {
    mic.onstart = () => {}

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('')

      var newSearchInputs = [...this.state.searchInputs]
      newSearchInputs[2] = transcript
      this.setState({
        searchInputs: newSearchInputs
      })

      mic.onerror = (event) => {}
    }
  }

  getJobIdFromServer = async () => {
    try {
      const response = await axios.get(base_url + '/getId')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  deleteJobFromDb = (id) => {
    axios
      .delete(base_url + '/deleteId' + '?jobId=' + id)
      .then(function (response) {
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  }

  analyseFacebookPost = async (postUrl, id) => {
    var executed = false
    var response_got = null
    axios
      .post(base_url + '/facebook-scrape', {
        link: postUrl,
        jobId: id
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
        const response = await axios.get(base_url + '/status' + '?jobId=' + id)

        var newStatus = [...this.state.status]
        newStatus[0] = response.data
        this.setState({
          status: newStatus
        })
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseTwitterPost = async (postUrl, id) => {
    var executed = false
    var response_got = null
    axios
      .post(base_url + '/tweet-scrape', {
        link: postUrl,
        jobId: id
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
        const response = await axios.get(base_url + '/status' + '?jobId=' + id)

        var newStatus = [...this.state.status]
        newStatus[1] = response.data
        this.setState({
          status: newStatus
        })
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseNormalNews = async (news, id) => {
    var executed = false
    var response_got = null
    axios
      .get(base_url + '/plain-text?text=' + news + '&jobId=' + id)
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
        const response = await axios.get(base_url + '/status' + '?jobId=' + id)

        var newStatus = [...this.state.status]
        newStatus[2] = response.data
        this.setState({
          status: newStatus
        })
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  analyseImage = async (imageFile, id) => {
    var executed = false
    var response_got = null
    const formData = new FormData()
    formData.append('file', imageFile)
    axios
      .post(base_url + '/analyze-image' + '?jobId=' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
        const response = await axios.get(base_url + '/status' + '?jobId=' + id)

        var newStatus = [...this.state.status]
        newStatus[3] = response.data
        this.setState({
          status: newStatus
        })
      } catch (error) {
        console.error(error)
      }
    }

    return response_got
  }

  //control the mic
  handleListen = (event) => {
    event.preventDefault()

    if (!this.micIsBlocked) {
      if (!this.state.isListening) {
        mic.start()
        mic.onend = () => {
          mic.start()
        }
      } else {
        mic.stop()
        mic.onend = () => {}
      }

      this.micIsBlocked = !this.micIsBlocked
      this.setState(
        {
          isListening: !this.state.isListening
        },
        () => {
          this.micIsBlocked = !this.micIsBlocked
        }
      )
    }
  }

  //control the Input-box
  handleSearchInput = (event) => {
    if (this.state.tabValue == 3) {
      var newSearchInputs = [...this.state.searchInputs]
      newSearchInputs[this.state.tabValue] = event.target.value

      if (this.state.tabValue == 3 && event.target.files[0] !== undefined) {
        this.setState({
          searchInputs: newSearchInputs,
          file: event.target.files[0],
          fileUrl: URL.createObjectURL(event.target.files[0])
        })
      }
    } else {
      var newSearchInputs = [...this.state.searchInputs]
      newSearchInputs[this.state.tabValue] = event.target.value
      this.setState({
        searchInputs: newSearchInputs
      })
    }
  }

  //On clicking refresh of the link
  handleRefresh = async (event) => {
    event.preventDefault()

    var tab = this.state.tabValue

    var newSearchInputs = [...this.state.searchInputs]
    newSearchInputs[tab] = ''

    var newPhase = [...this.state.phase]
    newPhase[tab] = 0

    var newJobIds = [...this.state.jobId]
    newJobIds[tab] = null

    var curJobId = this.state.jobId[tab]
    this.deleteJobFromDb(curJobId)

    if (tab === 3) {
      this.setState({
        phase: newPhase,
        searchInputs: newSearchInputs,
        jobId: newJobIds,
        file: null,
        fileUrl: null
      })
    } else {
      this.setState({
        phase: newPhase,
        searchInputs: newSearchInputs,
        jobId: newJobIds
      })
    }
  }

  //On submit of the link
  handleSubmit = async (event) => {
    event.preventDefault()

    var tab = this.state.tabValue

    var postText = this.state.searchInputs[tab] //to get the input
    var verdict

    var newPhase = [...this.state.phase]
    newPhase[tab] = 1

    var jobId = await this.getJobIdFromServer()

    var newJobIds = [...this.state.jobId]
    newJobIds[tab] = jobId

    this.setState({
      phase: newPhase,
      jobId: newJobIds
    })

    if (tab === 0) {
      //analyse facebook post
      verdict = await this.analyseFacebookPost(postText, jobId)
    } else if (tab === 1) {
      //analyse twitter post
      verdict = await this.analyseTwitterPost(postText, jobId)
    } else if (tab === 2) {
      //analyse normal news
      if (this.state.isListening) {
        this.handleListen(event)
      }

      verdict = await this.analyseNormalNews(postText, jobId)
    } else {
      var imageFile = this.state.file
      verdict = await this.analyseImage(imageFile, jobId)
    }

    var newOutput = [...this.state.output]
    newOutput[tab] = verdict.data

    newPhase = [...this.state.phase]
    newPhase[tab] = 2

    var newStatus = [...this.state.status]
    newStatus[tab] = -1

    this.setState({
      phase: newPhase,
      status: newStatus,
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
              handleRefresh={this.handleRefresh}
              handleListen={this.handleListen}
              /*adorement={this.state.adorement[0]}*/
              placeholder={this.state.placeholder[0]}
            />
            <div style={{ marginTop: '25px' }}>
              {this.state.phase[0] == 0 ? (
                <SearchButton
                  handleSubmit={this.handleSubmit}
                  searchInput={this.state.searchInputs[0]}
                />
              ) : this.state.phase[0] == 1 ? (
                <Progress
                  status={this.state.status[0]}
                  steps={this.state.progressSteps[0]}
                />
              ) : (
                <Result verdict={this.state.output[0]} />
              )}
            </div>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={1}>
            <FakeInputForm
              id={1}
              label={this.state.labels[1]}
              inputType={this.state.inputTypes[1]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[1]}
              handleSubmit={this.handleSubmit}
              handleListen={this.handleListen}
              handleRefresh={this.handleRefresh}
              /*adorement={this.state.adorement[1]}*/
              placeholder={this.state.placeholder[1]}
            />
            <div style={{ marginTop: '25px' }}>
              {this.state.phase[1] == 0 ? (
                <SearchButton
                  handleSubmit={this.handleSubmit}
                  searchInput={this.state.searchInputs[1]}
                />
              ) : this.state.phase[1] == 1 ? (
                <Progress
                  status={this.state.status[1]}
                  steps={this.state.progressSteps[1]}
                />
              ) : (
                <Result verdict={this.state.output[1]} />
              )}
            </div>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={2}>
            <FakeInputForm
              id={2}
              label={this.state.labels[2]}
              inputType={this.state.inputTypes[2]}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[2]}
              handleSubmit={this.handleSubmit}
              handleListen={this.handleListen}
              hasAudioFeature={true}
              isListening={this.state.isListening}
              handleRefresh={this.handleRefresh}
              /*adorement={this.state.adorement[2]}*/
              placeholder={this.state.placeholder[2]}
            />
            <div style={{ marginTop: '25px' }}>
              {this.state.phase[2] == 0 ? (
                <SearchButton
                  handleSubmit={this.handleSubmit}
                  searchInput={this.state.searchInputs[2]}
                />
              ) : this.state.phase[2] == 1 ? (
                <Progress
                  status={this.state.status[2]}
                  steps={this.state.progressSteps[2]}
                />
              ) : (
                <Result verdict={this.state.output[2]} />
              )}
            </div>
          </TabPanel>

          <TabPanel value={this.state.tabValue} index={3}>
            {this.state.searchInputs[3] !== '' ? (
              <img
                src={this.state.fileUrl}
                style={{
                  width: 250,
                  height: 120,
                  marginTop: '10px'
                }}
              />
            ) : null}

            <UploadButton handleSearchInput={this.handleSearchInput} />
            <FlushButton
              handleSearchInput={this.handleSearchInput}
              searchInput={this.state.searchInputs[3]}
              handleRefresh={this.handleRefresh}
            />
            <div style={{ marginTop: '25px' }}>
              {this.state.phase[3] == 0 ? (
                <SearchButton
                  handleSubmit={this.handleSubmit}
                  searchInput={this.state.searchInputs[3]}
                />
              ) : this.state.phase[3] == 1 ? (
                <Progress
                  status={this.state.status[3]}
                  steps={this.state.progressSteps[3]}
                />
              ) : (
                <Result verdict={this.state.output[3]} />
              )}
            </div>
          </TabPanel>
        </div>
      </Box>
    )
  }
}

class SearchButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <Button
          type="submit"
          variant="contained"
          startIcon={<TravelExploreIcon />}
          onClick={(event) => this.props.handleSubmit(event)}
          disabled={this.props.searchInput == '' ? true : false}
        >
          Predict
        </Button>
      </>
    )
  }
}

const Input = styled('input')({
  display: 'none'
})

class UploadButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <label htmlFor="icon-button-file">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={(event) => this.props.handleSearchInput(event)}
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<PhotoCamera />}
          style={{ margin: '0 10px 0 50px' }}
        >
          Upload
        </Button>
      </label>
    )
  }
}

class FlushButton extends React.Component {
  render() {
    return (
      <>
        <Button
          type="submit"
          variant="contained"
          startIcon={<DeleteIcon />}
          style={{
            backgroundColor: this.props.searchInput == '' ? '' : '#E60000'
          }}
          onClick={this.props.handleRefresh}
          disabled={this.props.searchInput == '' ? true : false}
        >
          Flush
        </Button>
      </>
    )
  }
}

export default FakeInputBoxTabs
