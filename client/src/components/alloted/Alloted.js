import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { url } from '../../config';

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
  bottomSpace: {
    marginBottom:10
  },
  accSum: {
    alignItems:'center'
  }
}))

function Alloted({deleteItem,workerId,municipalId}) {

  const classes = useStyles();
  const [loc, setLoc] = useState([]);
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
    const result = await fetch(`${url}/municipal/allotment/${workerId}`, requestOptions)
    const data =await result.json();
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

  const deleteAllotment = async(id) => {
    if(!municipalId) {
      seterror('Invalid Request');
      setShow(true);
    }

    var raw = JSON.stringify({
      _id:workerId,
      location:id,
      municipal:municipalId
    })

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			},
      body:raw
    };
    const result = await fetch(`${url}/municipal/allotment`,requestOptions);
    const data = await result.json();

    console.log(data);

    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }

    if(result.status === 200)
    {
      setShow2(true);
      setTimeout(() => {
        window.location.reload();
      },1200)
    }
  }
  
  useEffect(() => {
    getData();
    console.log('allotes',municipalId)
  }, [])

  return (
    <React.Fragment>
      <Typography align="center" variant="h5" className={classes.bottomSpace}>
        Alloted Locations
      </Typography>
      <div className={classes.root}>
        {
          loc.map((temp,index) => (
            <Accordion>
              <AccordionSummary
                classes={{ 
                  'content':classes.accSum
                  }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                {
                  deleteItem?<div>
                  <IconButton 
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteAllotment(temp._id);
                    }
                  }
                  >
                    <DeleteForeverIcon/>
                  </IconButton>
                </div>:null
                }
                
                <Typography className={classes.heading}>{ temp.name } </Typography>
                
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography variant="body1" component="div">
                    <Typography className={classes.bold} variant="button" component="span">Street : </Typography>{temp.street}
                  </Typography>
                  <Typography variant="body1" component="div">
                    <Typography className={classes.bold} variant="button" component="span">Landmark : </Typography>{temp.landmark}
                  </Typography>
                  <Typography variant="body1">
                    <Typography className={classes.bold} variant="button" component="span">Pincode : </Typography>{temp.pincode}
                  </Typography>
                  <Typography variant="body1">
                    <Typography className={classes.bold} variant="button" component="span">Size : </Typography>{temp.size} Sq.ft
                  </Typography>
                </div>

              </AccordionDetails>
            </Accordion>
          ))
        }
        {
          loc.length === 0?<Typography variant="h6">
            No Locations
          </Typography>:null
        }
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
    </React.Fragment>
  )
}

export default Alloted
