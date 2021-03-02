import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';import { useHistory } from 'react-router-dom';
;

const useStyles = makeStyles(() => ({
  more: {
    position:'absolute',
    right:2,
    color:'white'
  }
}))

function Logout() {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear();
    handleClose();
    history.push('/');
  }

  return (
    <React.Fragment>
      <IconButton onClick={handleClick} className={`${classes.more}`} aria-label="account-more">
        <MoreIcon/>
      </IconButton>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
    
  )
}

export default Logout
