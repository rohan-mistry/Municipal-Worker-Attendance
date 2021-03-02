import React, {useEffect, useState} from 'react'
import Layout from '../../../components/Layout'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const useStyles = makeStyles(() => ({
  
}))

function Worker() {
  const classes = useStyles();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [show2, setshow2] = useState(false);
  const [error, seterror] = useState('');
  const [workerData, setworkerData] = useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const removeWorker = async(id) => {
    MySwal.fire({
      icon: 'warning',
      title: 'Do you want to delete this worker?',
      confirmButtonText:'Yes',
      showCancelButton: true,
    }).then(async(result) => {
      if (result.isConfirmed) {

        const raw = JSON.stringify({
          _id:id,
          municipal:localStorage.getItem('_id') || sessionStorage.getItem('_id')
        })
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
          },
          body:raw
        };
        let result = await fetch(`${url}/worker/remove`,requestOptions);
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
      }
    })
    
  }

  const getData = async() => {
    const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };

    const result = await fetch(`${url}/municipal/workers/${_id}`,requestOptions);
    const data =await result.json();
    console.log(data);
    if(result.status !== 200) {
      seterror(data.message);
      setShow(true);
      return;
    }
    setworkerData(data.workers);
  }
  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <Layout>
        <PaperSurf>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Worker Name</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workerData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,index) => (
                <TableRow key={row.name + index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell >{row.phone}</TableCell>
                  <TableCell padding="checkbox">
                    <IconButton size="small" onClick={()=>history.push(`/admin/worker/update/${row._id}`)}>
                      <EditIcon/>
                    </IconButton>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <IconButton 
                      size="small"
                      onClick={() => removeWorker(row._id)} 
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={workerData.length}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[2,5,10,20,50]}
          />
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

export default Worker
