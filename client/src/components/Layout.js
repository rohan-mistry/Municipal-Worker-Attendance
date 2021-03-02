import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import InnerMenu from './InnerMenu';

const menuList = [
  {
    text:'Home',
    icon:<HomeIcon/>,
    path:'/admin'
  },
  {
    text:'Locations',
    icon:<AddLocationIcon/>,
    path:'/admin/location'
  },
  {
    text:'Workers',
    icon:<GroupIcon/>,
    path:'/admin/worker'
  },
  {
    text:'Requests',
    icon:<GroupAddIcon/>,
    path:'/admin/requests'
  }
]

export default function Layout({children}) {
  
  return (
    <InnerMenu menu={menuList} header={`Municipal Corporation`}>
      {children}
    </InnerMenu>
  );
}
