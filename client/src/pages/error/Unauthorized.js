import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
  },
  paper: {
    width:'100%',
    textAlign:'center',
    padding:50,
    fontFamily: 'system-ui'
  },
  errorNo: {
    fontSize:50
  },
  errorIcon: {
    fontSize:'10rem'
  },
  errorText: {
    fontSize:16,
    color: '#847272'
  },
  home: {
    marginTop:20
  }
}));

function Unauthorized() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className={classes.container}>
          <Paper className={classes.paper} elevation={3}>
            <div>
              <ErrorIcon
                className={classes.errorIcon}
              />
            </div>
            <div className={classes.errorNo}>
              404
            </div>
            <div className={classes.errorText}>
              You have either been blocked or not authorized to access this page
            </div>
            <div className={classes.home}>
              <Button
                variant="outlined"
                onClick={() => history.push('/')}
              >
                Home
              </Button>
            </div>
          </Paper>
        </div>
        
      </Container>
    </React.Fragment>
  )
}

export default Unauthorized
