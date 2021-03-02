import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid, Snackbar } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment'
import Alert from '@material-ui/lab/Alert';
import { url } from '../../../config';
import WorkLayout from '../../../components/WorkLayout'
import PaperSurf from '../../../components/PaperSurf';
import Alloted from '../../../components/alloted/Alloted';
import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom:15
  },
  bold: {
    fontWeight: 'bolder'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  topSpace: {
    marginTop:10
  },
  bottomSpace: {
    marginBottom:10
  },
  spaceAround: {
    margin:5
  },
  accSum: {
    alignItems:'center'
  }
}))

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }

  if (!values.email) {
    errors.email = 'Required';
  }

  return errors;
};

const validate2 = values => {
  const errors = {};
  if (!values.phone) {
    errors.phone = 'Required';
  }

  return errors;
};

function Profile() {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [error, seterror] = useState('');
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState(null);

  const getUserDetails =async() => {
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    const _id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const result = await fetch(`${url}/user/${_id}`, requestOptions)
    const data =await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    if(result.status === 200) {
      setusername(data.user.username);
      setemail(data.user.email);
    }
  }

  const getUserPhone =async() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    const _id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const result = await fetch(`${url}/worker/phone/${_id}`, requestOptions)
    const data =await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    if(result.status === 200) {
      setphone(data.worker.phone);
    }
  }

  const updateUserDetail  =async(values) => {

    const raw = JSON.stringify({
      username:values.username,
      email:values.email
    })
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			},
      body: raw
    }
    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");
    const result = await fetch(`${url}/user/update_detail/${_id}`, requestOptions)
    const data = await result.json();
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    setShow2(true);
    setTimeout(() => {
      window.location.reload();
    },1200)
    
  }

  const updateUserPhone  =async(values) => {

    const raw = JSON.stringify({
      phone:values.phone
    })
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			},
      body: raw
    }
    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");
    const result = await fetch(`${url}/worker/update_phone/${_id}`, requestOptions)
    const data = await result.json();
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    setShow2(true);
    setTimeout(() => {
      window.location.reload();
    },1200)
  }

  const formik = useFormik({
    initialValues:{
      username:username || '',
      email:email || ''
    },
    enableReinitialize:true,
    validate,
    onSubmit:async(values) => {
      await updateUserDetail(values);
    }
  })

  const formik2 = useFormik({
    initialValues:{
      phone: phone || null
    },
    enableReinitialize:true,
    validate:validate2,
    onSubmit:async(values) => {
      await updateUserPhone(values);
    }
  })

  useEffect(() => {
    getUserDetails();
    getUserPhone();
  }, [])

  return (
    <div>
      <WorkLayout>
        <Alloted 
          deleteItem={false}
          workerId={localStorage.getItem('_id') || sessionStorage.getItem('_id')}  
        />
        <PaperSurf>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField 
                  id="username"
                  name="username"
                  label="Username" 
                  variant="outlined"
                  fullWidth 
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  id="email"
                  name="email"
                  label="Email" 
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid md={12} xs={12}>
                <div align="right">
                  <Button
                    variant="contained" 
                    color="primary"
                    type="submit"
                    className={classes.spaceAround}
                  >
                    Update
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </PaperSurf>
        <PaperSurf>
          <form onSubmit={formik2.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField 
                  id="phone"
                  name="phone"
                  label="Phone"
                  type="number"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>
                  }}
                  value={formik2.values.phone}
                  onChange={formik2.handleChange}
                  onBlur={formik2.handleBlur}
                  error={formik2.touched.phone && Boolean(formik2.errors.phone)}
                  helperText={formik2.touched.phone && formik2.errors.phone}
                />
              </Grid>
              <Grid md={12} xs={12}>
                <div align="right">
                  <Button
                    variant="contained" 
                    color="primary"
                    type="submit"
                    className={classes.spaceAround}
                  >
                    Update
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
          
        </PaperSurf>
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
        <Snackbar
          open={show2} 
          autoHideDuration={2000} 
          onClose={()=>{
            setShow2(false);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert variant="filled" severity="success">
            Success!
          </Alert>
        </Snackbar>
      </WorkLayout>
    </div>
  )
}

export default Profile
