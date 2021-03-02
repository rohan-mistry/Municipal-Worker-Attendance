import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() => ({
  paper: {
    padding:15,
    marginBottom:20
  }
}))

function PaperSurf({children}) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      {children}
    </Paper>
  )
}

export default PaperSurf
