import React,{ useState, useEffect }from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../config';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { notifReset } from './ForgotPassword';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validate = values => {
  const errors = {};
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password does not match';
  }
  return errors;
};

export default function PasswordReset(props) {
  const classes = useStyles();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [notif, setnotif] = useState(notifReset);
  const token = props.match.params.token;
  const id = props.match.params.id;

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword:''
    },
    validate,
    onSubmit: async(values) => {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          password:values.password
        })
      };
      let result = await fetch(`${url}/password/reset/${token}/${id}`,requestOptions);
      let data = await result.json();
      console.log(data);
      if(result.status !== 200) {
        setnotif({severity:'error',error:data.message});
        setShow(true);
        return;
      } else if(result.status === 200) {
        setnotif({severity:'success',error:data.message});
        setShow(true);
        setTimeout(() => {
          history.push('/');
        },1200)
      }
    },
  });

  const checkValidToken = async() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    };
    
    let result = await fetch(`${url}/password/identify/${token}/${id}`,requestOptions);
    let data = await result.json();
    console.log(data);
    if(result.status !== 200) {
      setnotif({severity:'error',error:data.message});
      setShow(true);
      setTimeout(() => {
        history.push('/');
      },1200)
      return;
    } else if(result.status === 200) {
      if(data.message === 'Valid token') {
        setnotif({severity:'success',error:"Please provide a new password"});
        setShow(true);
      } else {
        setnotif({severity:'error',error:"Invalid Credentials"});
        setShow(true);
        setTimeout(() => {
          history.push('/');
        },1200)
      }
    }
    
  }
  useEffect(() => {
    checkValidToken();
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="subtitle2">
          We suggest you to set a strong password for your account
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            type="password"
            label="Password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
           <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Confirm Reset
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/">
                SignIn
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup/worker" >
                SignUp
              </Link>
            </Grid>
          </Grid>
        </form>
        <Snackbar 
          open={show} 
          autoHideDuration={2000} 
          onClose={()=>{
            setShow(false);
            setnotif(notifReset);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert variant="filled" severity={notif.serverity}>
            {notif.error}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
