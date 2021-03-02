import React, { useEffect,useState } from 'react'
import PaperSurf from '../../../components/PaperSurf'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Grid, InputAdornment, TablePagination, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MapIcon from '@material-ui/icons/Map';
import { url } from '../../../config';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GoogleMapReact from 'google-map-react';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import {PinPointer} from '../../worker/home/AttendanceList'

const useStyles = makeStyles((theme) => ({
  list: {
    marginTop:20
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  space: {
    margin:5
  }
}));

function WorkerAttendance() {

  const classes = useStyles();
  const [attendList, setattendList] = useState([])
  const [error, seterror] = useState('');
  const [show, setShow] = useState(false);
  const [open, setopen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [text, setText] = useState('');
  const [totalLength, settotalLength] = useState(0);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getList(newPage,rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    getList(0,parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showMap = (lat,long) => {
    setlat(lat);
    setlong(long);
    setopen(true);
  }
  const getList = async(pageNo,limit) => {

    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };

    const result = await fetch(`${url}/attendance/municipal/${_id}?page=${pageNo}&limit=${limit}&search=${text.trim()}&start=${start?Date.parse(start):0}&end=${end?Date.parse(end):Date.now()}`,requestOptions);
    const data = await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    } else if(result.status === 200) {
      setattendList(data.attendance);
      settotalLength(data && data.metadata && data.metadata[0] && data.metadata[0].total);
    }
    
  }

  const searchResult = () => {
    getList(0,rowsPerPage);
    setPage(0);
  }

  const filterDate = () => {
    getList(0,rowsPerPage);
    setPage(0);
  }

  useEffect(() => {
    getList(page,rowsPerPage);
  },[])

  return (
    <div className={classes.list}>
      <PaperSurf>
        <div>
        <TextField 
          id="search-list" 
          variant="outlined" 
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value) }
          placeholder="Search..."
          InputProps={{ 
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label="search"
                  onClick={() => searchResult()}
                >
                  <SearchIcon/>
                </IconButton>
              </InputAdornment>
            
           }}
         
        />
        </div>
        <div align="right">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2} justify="flex-end">
              <Grid item>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-start"
                  label="Start Date"
                  format="dd/MM/yyyy"
                  value={start}
                  onChange={(val) => setStart(val)}
                  KeyboardButtonProps={{
                    'aria-label': 'start date',
                  }}
                />
              </Grid>
              <Grid item>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="End Date"
                  format="dd/MM/yyyy"
                  value={end}
                  onChange={(val) => setEnd(val)}
                  KeyboardButtonProps={{
                    'aria-label': 'end date',
                  }}
                />
              </Grid>
              <Grid item xs={12} justify="space-evenly">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => window.location.reload()}
                  className={classes.space}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => filterDate()}
                  className={classes.space}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
            
          </MuiPickersUtilsProvider>
        
        </div>
        {
          attendList.length !== 0?
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Map</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendList
                .map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    { row && row.worker_detail && row.worker_detail[0] && row.worker_detail[0].name }
                  </TableCell>
                  <TableCell align="right">
                    { row && row.location_detail && row.location_detail[0] && row.location_detail[0].name }
                  </TableCell>
                  <TableCell align="right">{new Date(row.createdAt *1000).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{new Date(row.createdAt *1000).toLocaleTimeString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => showMap(row.lat,row.long)}
                    >
                      <MapIcon/>
                    </IconButton> 
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
              component="div"
              count={totalLength}
              page={page}
              onChangePage={handleChangePage}
              rowsPerPage={rowsPerPage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              rowsPerPageOptions={[2,5,10,20,50]}
            />
        </TableContainer>
        :'No Records'
      }
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
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={open}
        onClose={() => setopen(false)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
          Location 
          <IconButton
            className={classes.close}
            onClick={() => setopen(false)}
          >
            <HighlightOffIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{height:500,width:'100%'  }}>
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
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setopen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default WorkerAttendance
