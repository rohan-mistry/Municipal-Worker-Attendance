import React,{ useState }from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../config';

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
  if (!values.username) {
    errors.username = 'Required';
  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [error, seterror] = useState('');
  const formik = useFormik({
    initialValues: {
      username: '',
      password:'',
      remember:false
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
      let result = await fetch(`${url}/login`,requestOptions);
      let data = await result.json();
      if(result.status !== 200) {
        seterror(data.message);
        setShow(true);
        return;
      }
      console.log(data);
      if(values.remember)
      {
        localStorage.setItem('_id',data._id) ;
        localStorage.setItem('token',data.token);
        localStorage.setItem('role', data.role);
        
      } else {
        sessionStorage.setItem('_id',data._id) ;
        sessionStorage.setItem('token',data.token);
        sessionStorage.setItem('role', data.role);
      }
      if(data.role === 'admin') {
        history.push('/admin');
      }
      if(data.role === 'worker') {
        history.push('/worker');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControlLabel
            control={<Checkbox 
              checked={formik.remember}
              onChange={formik.handleChange}
              name="remember"
              id="remember"
              color="primary" 
              />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/password">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup/worker" >
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
        <Snackbar 
          open={show} 
          autoHideDuration={2000} 
          onClose={()=>{
            setShow(false);
            seterror('');
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
