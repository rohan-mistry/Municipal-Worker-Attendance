import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton, useMediaQuery } from '@material-ui/core';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { Link, useLocation } from 'react-router-dom';
import Logout from './Logout';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    flexShrink: 0,
  },
  drawerPaperMax: {
    width: drawerWidth,
  },
  drawerPaperMin: {
    width: 0
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuOpen: {
    color:'white'
  }
}));

export default function InnerMenu({children,menu,header}) {
  const classes = useStyles();
  const location = useLocation();
  const [open, setopen] = useState(true);
  const matches = useMediaQuery('(min-width:900px)');
  
  const closeMobile = () => {
    if(!matches)
      setopen(!open)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={() => setopen(!open)} edge="start" aria-label="menu-open-close">
            {open?<MenuOpenIcon fontSize="large" className={classes.menuOpen}/>:<MenuOutlinedIcon fontSize="large" className={classes.menuOpen}/>}
          </IconButton>
          <Typography variant="h6" noWrap>
            {header}
          </Typography>
          <Logout/>
        </Toolbar>
      </AppBar>
      <Drawer
        className={matches?open?classes.drawerPaperMax:classes.drawerPaperMin:`${classes.drawerPaperMax} ${classes.drawer}`}
        open={open}
        onClick={()=> closeMobile()}
        onKeyDown={()=> closeMobile()}
        variant={matches ? "persistent" : "temporary"}
        classes={{
          paper: matches?open?classes.drawerPaperMax:classes.drawerPaperMin:classes.drawerPaperMax
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {menu.map(item => (
              <Link to={item.path} key={item.text}>
                <ListItem button key={item.text} selected={location.pathname === item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}
