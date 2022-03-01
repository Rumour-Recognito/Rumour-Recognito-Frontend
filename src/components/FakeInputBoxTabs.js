import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import FacebookIcon from '@mui/icons-material/Facebook'
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
      searchInputs: ['', ''],
      output: ['', '']
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
        'http://localhost:5000/api/query/facebook-scrape?link=' + postLink
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }

  getNewsAPI = async (sentence) => {
    var now = new Date()
    now.setDate(now.getDate() - 19)
    now = dateFormat(now, 'yyyy-mm-dd')

    var url =
      'https://newsapi.org/v2/everything?' +
      'q=' +
      sentence +
      '&from=' +
      now +
      '&sortBy=popularity&' +
      'apiKey=eb8a5695e4a04479a5c688e080103f0c'

    //var url ='https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=tesla&from=2021-12-27&sortBy=popularity&apiKey=eb8a5695e4a04479a5c688e080103f0c'
    try {
      const response = await axios.get(url, {
        header: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Credentials': true
        }
      })
      return response
    } catch (error) {
      console.error(error)
    }
  }

  getSimilarNews = async (sentences) => {
    var related_news = {}

    for (var i = 0; i < sentences.length; i++) {
      const response = await this.getNewsAPI(sentences[i])
      related_news[sentences[i]] = response.data.articles
    }

    console.log('related_news: ')
    console.log(related_news)
    return related_news
  }

  getSimilarNewsFromFile = () => {
    return results
  }

  getLineToNewsListMap = (news_api_response) => {
    var postList = []
    for (var sentence in news_api_response) {
      var curList_withOtherInfo = news_api_response[sentence]
      var curTitles = []
      curList_withOtherInfo.forEach((data) => {
        curTitles.push(data.title)
      })

      var curJson = {
        line: sentence,
        news: curTitles
      }

      postList.push(curJson)
    }

    return postList
  }

  getVerdictFromStanceAPI = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/execute')
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

      postText = scraper_response.data[0].post_text
    } else {
      //for general news
      postText = this.state.searchInputs[tab]
    }

    //remove Links from the sentences
    sentences = this.removeLinksAndGetSentences(postText)

    //remove out special characters
    for (var i = 0; i < sentences.length; i++) {
      sentences[i] = this.filterTextFromSpecialCharacters(sentences[i])
    }

    //remove empty sentences from the list
    sentences = this.removeEmptySentence(sentences)

    console.log('sentence')
    console.log(sentences)

    var news_api_response = await this.getSimilarNews(sentences)
    //var news_api_response = await this.getSimilarNewsFromFile(sentences)

    var postList = await this.getLineToNewsListMap(news_api_response)

    console.log('post Request List')
    console.log(postList)

    var self = this
    axios
      .post('http://localhost:5000/api/related-news', {
        data: postList
      })
      .then(async function (response) {
        console.log('testing b-response')
        console.log(response)

        var verdict = await self.getVerdictFromStanceAPI()
        console.log(verdict)
        alert(verdict)

        var newOutput = self.state.output
        newOutput[tab] = verdict
        self.setState({
          output: newOutput
        })
      })
      .catch(function (error) {
        console.log(error)
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
              label="Facebook"
              {...a11yProps(0)}
              iconPosition="start"
            />
            <Tab
              icon={<FeedIcon />}
              label="Normal News"
              {...a11yProps(1)}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <div>
          <TabPanel value={this.state.tabValue} index={0}>
            <FakeInputForm
              id={0}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[0]}
              handleSubmit={this.handleSubmit}
              adorement={'https://www.facebook.com/'}
              placeholder={'Paste the post link'}
            />
            <p className="mt-5">{this.state.output[0]}</p>
          </TabPanel>
          <TabPanel value={this.state.tabValue} index={1}>
            <FakeInputForm
              id={1}
              handleSearchInput={this.handleSearchInput}
              searchInputValue={this.state.searchInputs[1]}
              handleSubmit={this.handleSubmit}
              placeholder={'Provide the news'}
            />
            <p className="mt-5">{this.state.output[1]}</p>
          </TabPanel>
        </div>
      </Box>
    )
  }
}

export default FakeInputBoxTabs
