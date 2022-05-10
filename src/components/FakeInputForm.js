import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
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
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={this.props.placeholder}
            inputProps={{ 'aria-label': this.props.placeholder }}
            onChange={(event) => this.props.handleSearchInput(event)}
            value={this.props.searchInputValue}
            startAdornment={
              <InputAdornment position="start">
                {this.props.adorement}
              </InputAdornment>
            }
          />
          <IconButton
            type="submit"
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={(event) => this.props.handleSubmit(event)}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </React.Fragment>
    )
  }
}

export default FakeInputForm
