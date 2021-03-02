import React, {useEffect, useState} from 'react'
import Layout from '../../../components/Layout'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../../config';
import PaperSurf from '../../../components/PaperSurf';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import EditIcon from '@material-ui/icons/Edit';

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



function Location() {
  const classes = useStyles();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [show2, setshow2] = useState(false);
  const [error, seterror] = useState('');
  const [locData, setlocData] = useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getData = async() => {
    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };

    const result = await fetch(`${url}/municipal/locations/${_id}`,requestOptions);
    const data =await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    setlocData(data.locations);
  }
  useEffect(() => {
    getData();
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      street:'',
      landmark:'',
      pincode:null,
      size:null
    },
    validate,
    onSubmit: async(values) => {

      const _id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          ...values,
          municipal:_id
        })
      };
      let result = await fetch(`${url}/municipal/locations`,requestOptions);
      let data = await result.json();
      if(result.status !== 200) {
        seterror(data.message);
        setShow(true);
      } else {
        setshow2(true);
        setTimeout(() => {
          window.location.reload();
        },2000)
        
      }
      console.log(data);
      
    },
  });

  return (
    <div>
      <Layout>
        <PaperSurf>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Area Name</b>
                </TableCell>
                <TableCell align="right"><b>Pincode</b></TableCell>
                <TableCell align="right"><b>Street</b></TableCell>
                <TableCell align="right"><b>Landmark</b></TableCell>
                <TableCell align="right"><b>Size (sq.ft)</b></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,index) => (
                <TableRow key={row.name + index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.pincode}</TableCell>
                  <TableCell align="right">{row.street}</TableCell>
                  <TableCell align="right">{row.landmark}</TableCell>
                  <TableCell align="right">{row.size}</TableCell>
                  <TableCell padding="checkbox">
                    <IconButton size="small" onClick={e=>history.push(`/admin/location/update/${row._id}`)}>
                      <EditIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={locData.length}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[2,5,10,20,50]}
          />
        </PaperSurf>
        <PaperSurf>
          <Typography align="center" variant="h5">Add Location </Typography>
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
                <div align="right" className={classes.b}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create
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
          setshow2(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert variant="filled" severity="success">
          Success!
        </Alert>
      </Snackbar>
      </Layout>
      
    </div>
  )
}

export default Location
