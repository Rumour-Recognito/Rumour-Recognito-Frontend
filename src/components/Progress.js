import * as React from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

class LinearProgressWithLabel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...this.props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            this.props.value
          )}%`}</Typography>
        </Box>
      </Box>
    )
  }
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired
}

const steps = [5, 10, 12, 25, 80, 100]

class LinearWithValueLabel extends React.Component {
  constructor(props) {
    super(props)
  }

  isStepFailed = (step) => {
    return step === 1
  }

  render() {
    return (
      <div>
        <Box sx={{ width: '100%', marginTop: '30px' }}>
          <LinearProgressWithLabel
            value={this.props.status == -1 ? 2 : steps[this.props.status]}
          />
        </Box>
        <Box sx={{ width: '100%', marginTop: '30px' }}>
          <Stepper activeStep={this.props.status} alternativeLabel>
            {this.props.steps.map((label) => (
              <Step
                key={label}
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#43a047' // circle color (COMPLETED)
                  },
                  '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                    {
                      color: 'text.secondary' // Just text label (COMPLETED)
                    },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'primary.main' // circle color (ACTIVE)
                  },
                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                    {
                      color: 'text.primary' // Just text label (ACTIVE)
                    },
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: 'common.white' // circle's number (ACTIVE)
                  }
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
    )
  }
}

export default LinearWithValueLabel
