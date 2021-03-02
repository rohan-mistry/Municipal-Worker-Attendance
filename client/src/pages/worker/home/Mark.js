import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { url } from '../../../config';
import {PinPointer} from './AttendanceList'

const useStyles = makeStyles((theme) => ({
  autoBox: {
    marginTop:15,
    marginBottom:25,
  },
  mark: {
    width:'100%',
    height:'100%'
  }
}))


function Mark() {

  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [loc, setLoc] = useState([]);
  const [newLoc, setnewLoc] = useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [show2, setShow2] = useState(false);
  const [error, seterror] = useState('');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const getData = async() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    const _id = localStorage.getItem('_id') || sessionStorage.getItem('_id'); 
    const result = await fetch(`${url}/municipal/allotment/${_id}`, requestOptions)
    const data = await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    if(data.locs && data.locs[0] && data.locs[0].list_locations) {
      setLoc(data.locs[0].list_locations);
    }
    
  }
  
  const markAttendance = async() => {

    getLocation();
    if(!lat || !long) {
      seterror('Loading the Co-ordinates, please wait!');
      setShow(true);
      return;
    }
    if(!newLoc) {
      seterror('Please select a location');
      setShow(true);
      return;
    }
    console.log(newLoc,'selected');
    const worker = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const raw = JSON.stringify({
      lat,
      long,
      worker,
      location:newLoc._id,
      municipal:newLoc.municipal
    })

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			},
      body:raw
    };
    const result = await fetch(`${url}/attendance`,requestOptions);
    const data = await result.json();

    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    } else if(result.status === 200) {
      setShow2(true);
    }
  }

  useEffect(() => {
    getData();
    getLocation();
  }, [])

  function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
      "Longitude: " + position.coords.longitude);

    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
  }
  
  function showError(error) {
    let err;
    switch(error.code) {
      case error.PERMISSION_DENIED:
        err = "Permission is blocked or denied for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        err = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        err = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        err = "An unknown error occurred.";
        break;
    }
    seterror(err);
    setShow(true);
  }
  
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else { 
      seterror("Geolocation is not supported by this browser.");
      setShow(true);
    }
  }

  return (
    <div>
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          // bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
          defaultCenter={{
            lat: lat,
            lng: long
          }}
          defaultZoom={11}
        >
          <PinPointer
            lat={lat}
            lng={long}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
      <div className={classes.autoBox}>
        <Grid container>
          <Grid item md={10} xs={10}>
            <Autocomplete
              id="locations-attendance"
              value={newLoc}
              onChange={(event, newValue) => setnewLoc(newValue)}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={loc}
              getOptionLabel={(option) => option.name}
              style={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} 
                label="Select Location to Mark Attendance" 
                variant="outlined"
                fullWidth
              />}
            />
          </Grid>
          <Grid item md={2} xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => markAttendance()}
              className={classes.mark}
            >
              Mark
            </Button>
          </Grid>
        </Grid>
        
      </div>
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

export default Mark
