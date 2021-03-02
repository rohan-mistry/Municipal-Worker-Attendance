import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, makeStyles } from '@material-ui/core';
import { url } from '../../../config';

const useStyles = makeStyles({
  root: {
    // minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  action: {
    justifyContent: 'space-around'
  }
});

function Request() {
  const classes = useStyles();
  const [pending, setpending] = useState([])

  const getData = async() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    const _id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const result = await fetch(`${url}/municipal/requests/${_id}`, requestOptions)
    const data =await result.json();
    console.log(data);
    if(result.status === 200) {
      setpending(data.pending);
    }
    
  }
  useEffect(() => {
    getData();
  }, []);

  const updateStatus = async(status,id) => {
    const municipal = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        authenticated:status,
        _id:id,
        municipal
      })
    };
    const result = await fetch(`${url}/municipal/requests`,requestOptions);
    const data = await result.json();
    if(result.status !== 200) {
      alert(data.message);
    } else {
      window.location.reload();
    }
    console.log(data);
  }

  return (
    <div>
      <Layout>
        <div>
          <Grid container spacing={2}>
            {
              pending.map(req => (
                <Grid key={req._id} item md={4} xs={12}>
                  <Card className={classes.root}>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        {req.name}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Phone: {req.phone}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => updateStatus(true,req._id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => updateStatus(false,req._id)}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            }
            {
              pending.length === 0?<Typography variant="h6">
                No Requests
              </Typography>:null
            }
          </Grid>
        </div>
      </Layout>
    </div>
  )
}

export default Request
