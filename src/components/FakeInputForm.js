import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import MicIcon from '@mui/icons-material/Mic'
import RefreshIcon from '@mui/icons-material/Refresh'
import InputAdornment from '@mui/material/InputAdornment'

class FakeInputForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <Paper
          component="form"
          sx={{
            p: '2px 10px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search" disabled>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ flex: 1 }}
            type={this.props.inputType}
            placeholder={this.props.placeholder}
            inputProps={{ 'aria-label': this.props.placeholder }}
            onChange={(event) => this.props.handleSearchInput(event)}
            value={this.props.searchInputValue}
          />
          {this.props.hasAudioFeature ? (
            <Voice
              handleListen={this.props.handleListen}
              isListening={this.props.isListening}
            />
          ) : null}
          <IconButton
            sx={{ p: '10px' }}
            aria-label="refresh"
            onClick={this.props.handleRefresh}
          >
            <RefreshIcon />
          </IconButton>
        </Paper>
      </React.Fragment>
    )
  }
}

class Voice extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <IconButton
          sx={{ p: '10px' }}
          aria-label="search"
          onClick={(event) => this.props.handleListen(event)}
        >
          <MicIcon
            style={{ color: this.props.isListening ? 'red' : '#1976d2' }}
          />
        </IconButton>
      </>
    )
  }
}

export default FakeInputForm
