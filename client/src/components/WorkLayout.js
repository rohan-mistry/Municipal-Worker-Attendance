import React from 'react'
import InnerMenu from './InnerMenu'
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const menuList = [
  {
    text:'Home',
    icon:<HomeIcon/>,
    path:'/worker'
  },
  {
    text:'Profile',
    icon:<AccountCircleIcon/>,
    path:'/worker/profile'
  }
]

function WorkLayout({children}) {
  return (
    <InnerMenu menu={menuList} header={'Worker'}>
      {children}
    </InnerMenu>
  )
}

export default WorkLayout
