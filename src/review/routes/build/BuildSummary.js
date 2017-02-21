import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStyleSheet } from 'jss-theme-reactor'
import withStyles from 'material-ui/styles/withStyles'
import Text from 'material-ui/Text'
import Paper from 'material-ui/Paper'
import recompact from 'modules/recompact'
import WatchTask from 'modules/components/WatchTask'
import reduceJobStatus from 'modules/jobs/reduceJobStatus'

const styleSheet = createStyleSheet('BuildSummary', () => {
  return {
    paper: {
      overflow: 'auto',
      marginBottom: 8 * 2,
    },
  }
})

function formatShortCommit(commit) {
  return commit.substring(0, 7)
}

export function BuildSummary(props) {
  const {
    fetch,
    classes,
  } = props

  return (
    <div>
      <Text type="headline" component="h3" gutterBottom>
        {'Summary'}
      </Text>
      <Paper className={classes.paper}>
        <WatchTask task={fetch}>
          {() => {
            const {
              build: {
                createdAt,
                baseScreenshotBucket: {
                  commit: baseCommit,
                },
                compareScreenshotBucket: {
                  commit: compareCommit,
                  branch,
                },
              },
              screenshotDiffs,
            } = fetch.output.data

            const jobStatus = reduceJobStatus(screenshotDiffs.map(({ jobStatus }) => jobStatus))

            const validationStatus = screenshotDiffs
              .every(screenshotDiff => screenshotDiff.validationStatus === 'accepted') ?
                'accepted' :
                'unknown'

            return (
              <ul>
                <li>{`Job status: ${jobStatus}`}</li>
                <li>{`Validation status: ${validationStatus}`}</li>
                <li>{`Commit: ${formatShortCommit(compareCommit)}`}</li>
                <li>{`Branch: ${branch}`}</li>
                <li>
                  {`Compare: ${formatShortCommit(baseCommit)}...${
                    formatShortCommit(compareCommit)}`}
                </li>
                <li>{`Date: ${new Intl.DateTimeFormat().format(new Date(createdAt))}`}</li>
              </ul>
            )
          }}
        </WatchTask>
      </Paper>
    </div>
  )
}

BuildSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  fetch: PropTypes.object.isRequired,
}

export default recompact.compose(
  withStyles(styleSheet),
  connect(state => state.ui.build),
)(BuildSummary)
