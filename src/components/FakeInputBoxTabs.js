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
import results from '../data/result_news_20.json'
import dateFormat from 'dateformat'

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

  //function to remove links from sentences
  removeLinksAndGetSentences = (text) => {
    var wordsInText = text.split('\n')

    var filteredWord = []
    wordsInText.forEach((word) => {
      if (!word.includes('http') && !word.includes('www'))
        filteredWord.push(word)
    })

    return filteredWord
  }

  //function to filterTextFromSpecialCharacters
  filterTextFromSpecialCharacters = (text) => {
    text = text.trim()

    var filteredText = []
    var specialChars = '/*!@#$%^&*()"{}_[]|\\?/<>,.'
    for (var i = 0; i < text.length; i++) {
      if (specialChars.includes(text.charAt(i))) {
        filteredText.push(' ')
      } else {
        filteredText.push(text.charAt(i))
      }
    }

    return filteredText.join('').trim()
  }

  removeEmptySentence = (sentences) => {
    var nonEmptySentences = []
    sentences.forEach((sentence) => {
      if (sentence !== '') nonEmptySentences.push(sentence)
    })

    return nonEmptySentences
  }

  scrapeFacebookData = async (postLink) => {
    try {
      const response = await axios.get(
        'http://localhost:5000/facebook-scrape?id=' + postLink
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }

  translateIndividually = async (sentence) => {
    try {
      const response = await axios.get(
        'http://localhost:5000/translate?text=' + sentence
      )
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  translateToEnglish = async (sentences) => {
    var translated_sentences = []

    for (var i = 0; i < sentences.length; i++) {
      var translated_sentence = await this.translateIndividually(sentences[i])
      console.log(translated_sentence)
      translated_sentences.push(translated_sentence)
    }

    console.log('Translated Test: ')
    console.log(translated_sentences)
    return translated_sentences
  }

  getSimilarNews = async (sentences) => {
    try {
      const response = await axios.post('http://localhost:5000/query-list', {
        queryList: sentences
      })
      console.log(response)
      return response
    } catch (error) {
      console.error(error)
    }

    /*axios
      .post('http://localhost:5000/query-list', {
        queryList: sentences
      })
      .then(async function (response) {
        console.log('testing b-response')
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })*/
  }

  getVerdictFromStanceAPI = async () => {
    try {
      const response = await axios.get('http://localhost:5000/execute')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  //On submit of the link
  handleSubmit = async (event) => {
    event.preventDefault()

    var tab = this.state.tabValue
    var sentences = []

    var postText = this.state.searchInputs[tab] //to get the input

    if (tab === 0) {
      //scrape data for facebook
      var postLink = postText
      var scraper_response = await this.scrapeFacebookData(postLink)

      postText = scraper_response.data.post_text
    }

    //remove Links from the sentences
    sentences = this.removeLinksAndGetSentences(postText)

    //remove out special characters
    for (var i = 0; i < sentences.length; i++) {
      sentences[i] = this.filterTextFromSpecialCharacters(sentences[i])
    }

    //remove empty sentences from the list
    sentences = this.removeEmptySentence(sentences)

    //translate to english
    sentences = await this.translateToEnglish(sentences)

    //get all similar news from google-search
    var something = await this.getSimilarNews(sentences)

    //execute route line
    var verdict = await this.getVerdictFromStanceAPI()
    console.log(verdict)
    alert(verdict)

    var newOutput = this.state.output
    newOutput[tab] = verdict
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
