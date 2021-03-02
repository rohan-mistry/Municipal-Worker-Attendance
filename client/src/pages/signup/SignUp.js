import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { url } from '../../config';
import { useFormik } from 'formik';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import ReCAPTCHA from "react-google-recaptcha";
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom:20,
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    width:'100%'
  }
}));

const validate = values => {
  const errors = {};
  if (!values.fullname) {
    errors.fullname = 'Required';
  }
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.municipal) {
    errors.municipal = 'Required';
  }
  if (!values.phone) {
    errors.phone = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.confirm_password) {
    errors.confirm_password = 'Required';
  }
  if(values.password !== values.confirm_password) {
    errors.confirm_password = 'Password does not match'
  }

  return errors;
};

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [municipals, setmunicipals] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [error, seterror] = useState('');
  const [recapt, setrecapt] = useState(false);

  const closeDialog = () => {
    setShow2(false);
    history.push('/');
  }

  const formik = useFormik({
    initialValues: {
      fullname: '',
      password:'',
      username:'',
      phone:null,
      email:'',
      confirm_password:'',
      municipal:''
    },
    validate,
    onSubmit: async(values) => {
      if(!recapt) {
        alert('Complete recaptcha!');
        return;
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ 
          name:values.fullname,
          username:values.username,
          password:values.password,
          phone:values.phone,
          email:values.email,
          municipal_id:values.municipal 
        })
      };
      console.log(requestOptions);
      
      let result = await fetch(`${url}/user/signup/worker`,requestOptions);
      let data = await result.json();
      if(result.status !== 200) {
        setShow(true);
        seterror(data.message);
      } else if(result.status === 200) {
        seterror('');
        setShow2(true);
      }
    },
  });

  const getData = async() => {
    var requestOptions = {
      method: 'GET',
    };
    
    const result = await fetch(`${url}/municipal`, requestOptions)
    const data = await result.json();
    console.log(data);
    setmunicipals(data.allMunicipals);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="fullname"
                variant="outlined"
                fullWidth
                id="fullname"
                value={formik.fullname}
                onChange={formik.handleChange}
                label="Full Name"
                onBlur={formik.handleBlur}
                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                helperText={formik.touched.fullname && formik.errors.fullname}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                id="email"
                value={formik.fullname}
                onChange={formik.handleChange}
                label="Email"
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                variant="outlined"
                fullWidth
                type="number"
                id="phone"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>
                }}
                value={formik.phone}
                onChange={formik.handleChange}
                label="Phone"
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                variant="outlined" 
                className={classes.formControl}
                error={formik.touched.municipal && Boolean(formik.errors.municipal)}
              >
                <InputLabel id="demo-simple-select-label">Municipal</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="municipal"
                  name="municipal"
                  value={formik.municipal}
                  label="Municipal"
                  onChange={formik.handleChange}
                  fullWidth
                  onBlur={formik.handleBlur}
                >
                  {municipals.map(temp => (
                    <MenuItem key={temp._id} value={temp._id}>{temp.name} </MenuItem>
                  ))}
                 
                </Select>
                <FormHelperText>{formik.touched.municipal && formik.errors.municipal}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={formik.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formik.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                value={formik.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                helperText={formik.touched.confirm_password && formik.errors.confirm_password}
              />
            </Grid>
            
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <ReCAPTCHA
                sitekey="6LfOy0YaAAAAAAl9R1gwoTmWrpMJgryypz7j7vtX"
                onChange={() => setrecapt(true)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/">
                Already have an account? Sign in
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
        <Dialog
          open={show2}
          onClose={() => closeDialog()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have been successfully signed up. Your account is under review and will be activated within few hours.
              Please try to login after few hours
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> closeDialog()} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
}