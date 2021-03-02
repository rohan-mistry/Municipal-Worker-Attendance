import React,{ useState }from 'react';
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
import MailOutlineIcon from '@material-ui/icons/MailOutline';

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
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};

export const notifReset = {
  severity:'',
  error:''
}

export default function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [notif, setnotif] = useState(notifReset);
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    onSubmit: async(values) => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values)
      };
      let result = await fetch(`${url}/password`,requestOptions);
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MailOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password ?
        </Typography>
        <Typography component="h1" variant="subtitle2">
          Enter the registered email to reset your account password 
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Mail
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
          <Alert variant="filled" severity={notif.severity}>
            {notif.error}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
