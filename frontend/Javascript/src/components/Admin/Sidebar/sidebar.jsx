import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import './sidebar.css'

const navMenu = [
  {
      icon: <EqualizerIcon />,
      label: "Dashboard",
      ref: "/admin/dashboard",
  },
  {
      icon: <ShoppingBagIcon />,
      label: "Orders",
      ref: "/admin/orders",
  },
  {
      icon: <InventoryIcon />,
      label: "Products",
      ref: "/admin/products",
  },
  {
      icon: <AddBoxIcon />,
      label: "Add Product",
      ref: "/admin/new_product",
  },
  {
      icon: <GroupIcon />,
      label: "Users",
      ref: "/admin/users",
  },
  {
      icon: <ReviewsIcon />,
      label: "Reviews",
      ref: "/admin/reviews",
  },
  {
      icon: <AccountBoxIcon />,
      label: "My Profile",
      ref: "/account",
  },
  {
      icon: <LogoutIcon />,
      label: "Logout",
  },
];

function sidebar() {
  return (
    <div>
        
    </div>
  )
}

export default sidebar