import React, {useState, useEffect} from 'react'
import Layout from '../../../components/Layout'
import PaperSurf from '../../../components/PaperSurf'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../../config';

const useStyles = makeStyles(() => ({
  
}))

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.street) {
    errors.street = 'Required';
  }
  if (!values.landmark) {
    errors.landmark = 'Required';
  }
  if (!values.pincode) {
    errors.pincode = 'Required';
  }
  if (!values.size) {
    errors.size = 'Required';
  }

  return errors;
};


function UpdateLoc(props) {
  const classes = useStyles();
  const history = useHistory();
  const [loc, setLoc] = useState({});
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [error, seterror] = useState('');

  const getData = async() => {
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    
    const result = await fetch(`${url}/municipal/single_location/${props.match.params.id}`, requestOptions)
    const data =await result.json();
    console.log(data);
    if(result.status === 200) {
      setLoc(data.location);
    }
    
  }
  useEffect(() => {
    getData();
  }, [])
  const formik = useFormik({
    initialValues: {
      name: loc.name || '',
      street:loc.street || '',
      landmark: loc.landmark || '',
      pincode: loc.pincode || '',
      size:loc.size || ''
    },
    enableReinitialize:true,
    validate,
    onSubmit: async(values) => {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          ...values,
        })
      };
      let result = await fetch(`${url}/municipal/locations/${props.match.params.id}`,requestOptions);
      let data = await result.json();
      console.log(data);
      if(result.status !== 200) {
        seterror(data.message);
        setShow(true);
      } else {
        setShow2(true);
        setTimeout(() => {
          history.push('/admin/location');
        },2000)
        
      }
      
    },
  });

  return (
    <div>
      <Layout>
        <PaperSurf>
        <Typography align="center" variant="h5">Update Location </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Area Name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="street"
                  label="Street Name"
                  name="street"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && formik.errors.street}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="landmark"
                  label="Landmark"
                  name="landmark"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.landmark}
                  error={formik.touched.landmark && Boolean(formik.errors.landmark)}
                  helperText={formik.touched.landmark && formik.errors.landmark}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="pincode"
                  type="number"
                  label="Pincode"
                  name="pincode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pincode}
                  error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                  helperText={formik.touched.pincode && formik.errors.pincode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="size"
                  type="number"
                  label="Size (sq.ft)"
                  name="size"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.size}
                  error={formik.touched.size && Boolean(formik.errors.size)}
                  helperText={formik.touched.size && formik.errors.size}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <div align="right">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Update
                  </Button>
                </div>
              </Grid>
              
            </Grid>
          </form>
        </PaperSurf>
      </Layout>
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
    </div>
  )
}

export default UpdateLoc
