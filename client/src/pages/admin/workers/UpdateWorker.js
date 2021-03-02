import React, {useState, useEffect} from 'react'
import Layout from '../../../components/Layout'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { url } from '../../../config';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alloted from '../../../components/alloted/Alloted';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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


function UpdateWorker(props) {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [munLocs, setmunLocs] = useState([]);
  const [newLoc, setnewLoc] = useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [show2, setShow2] = useState(false);
  const [error, seterror] = useState('');
  const [addShow, setaddShow] = useState(true);

  var getMunLoc = async() => {
    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };

    const result = await fetch(`${url}/municipal/locations/${_id}`,requestOptions);
    const data = await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    setmunLocs(data.locations);
  }

  useEffect(() => {
    getMunLoc();
  }, [])
  
  const createAllotment = async() => {

    if(newLoc === null) {
      seterror('Please select a location');
      setShow(true);
      return;
    }
    const municipal = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const raw = JSON.stringify({
      _id:props.match.params.id,
      location:newLoc._id,
      municipal
    })

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			},
      body:raw
    };
    const result = await fetch(`${url}/municipal/allotment`,requestOptions);
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

  return (
    <div>
      <Layout>
        <Alloted
          deleteItem={true}
          municipalId={localStorage.getItem("_id") || sessionStorage.getItem("_id")}
          workerId={props.match.params.id}
        />
        <div className={`${classes.topSpace} ${classes.bottomSpace}`}>
          {
            !addShow?<Autocomplete
            id="combo-box-demo"
            value={newLoc}
            onChange={(event, newValue) => setnewLoc(newValue)}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={munLocs}
            getOptionLabel={(option) => option.name}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} 
              label="Select Location" 
              variant="outlined"
              fullWidth
            />}
          />:null
          }
        </div>
        <div align="right" className={classes.topSpace}>
          {
            addShow?<IconButton
              onClick={() => setaddShow(false)}
            >
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>:<>
          <Button 
            className={classes.spaceAround} 
            variant="outlined" 
            color="secondary"
            onClick={() => setaddShow(true)}
          >
            Cancel
          </Button>
          <Button 
            className={classes.spaceAround} 
            variant="contained" 
            color="primary"
            onClick={() => createAllotment()}
          >
            ALLOT
          </Button>
          </>
          }
          
          
        </div>
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

export default UpdateWorker
