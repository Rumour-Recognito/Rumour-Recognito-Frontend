import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'

export default class TabPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        role="tabpanel"
        hidden={this.props.value !== this.props.index}
        id={`simple-tabpanel-${this.props.index}`}
        aria-labelledby={`simple-tab-${this.props.index}`}
        {...this.props.other}
      >
        {this.props.value === this.props.index && (
          <Box sx={{ p: 3 }}>{this.props.children}</Box>
        )}
      </div>
    )
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}
