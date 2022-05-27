import * as React from 'react'
import { createTheme, styled } from '@mui/material/styles'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import ReportIcon from '@mui/icons-material/Report'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Button from '@mui/material/Button'

class Result extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <div className="resultant-verdict">
          <div>
            {this.props.verdict == 'LOOKS REAL' ? (
              <RealNews verdict={this.props.verdict} />
            ) : this.props.verdict == 'LOOKS FAKE' ? (
              <FakeNews verdict={this.props.verdict} />
            ) : (
              <UnpredictableNews verdict={this.props.verdict} />
            )}
          </div>
        </div>
      </>
    )
  }
}

class RealNews extends React.Component {
  render() {
    return (
      <Button
        variant="outlined"
        startIcon={<FactCheckIcon style={{ fontSize: '4vh' }} />}
        style={{ color: 'green', border: 'none', fontSize: '4vh' }}
      >
        {this.props.verdict}
      </Button>
    )
  }
}

class FakeNews extends React.Component {
  render() {
    return (
      <Button
        variant="outlined"
        startIcon={<ReportIcon style={{ fontSize: '4vh' }} />}
        style={{ color: '#d32f2f', border: 'none', fontSize: '4vh' }}
      >
        {this.props.verdict}
      </Button>
    )
  }
}

class UnpredictableNews extends React.Component {
  render() {
    return (
      <Button
        variant="outlined"
        startIcon={<ReportProblemIcon style={{ fontSize: '4vh' }} />}
        style={{ color: '#afb42b', border: 'none', fontSize: '4vh' }}
      >
        {this.props.verdict}
      </Button>
    )
  }
}

export default Result
