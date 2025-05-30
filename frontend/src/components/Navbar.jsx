import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';

const drawerWidth = 240;

export default function Navbar(props) {
  const { content } = props;
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [openTransaction, setOpenTransaction] = React.useState(false);

  const handleTransactionClick = () => {
    setOpenTransaction(!openTransaction);
  };

  const logoutUser = () => {
    AxiosInstance.post(`logoutall/`, {})
      .then(() => {
        localStorage.removeItem("Token");
        navigate('/');
      });
  };

  // Auto-expand the Transaction section if one of its child paths is active
  React.useEffect(() => {
    if (path.startsWith("/transaction")) {
      setOpenTransaction(true);
    }
  }, [path]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Society Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>

            <ListItem key="member" disablePadding>
              <ListItemButton component={Link} to="/home" selected={"/home" === path}>
                <ListItemIcon><RememberMeIcon /></ListItemIcon>
                <ListItemText primary="Member" />
              </ListItemButton>
            </ListItem>

            <ListItem key="transaction" disablePadding>
              <ListItemButton onClick={handleTransactionClick}>
                <ListItemIcon><ReceiptIcon /></ListItemIcon>
                <ListItemText primary="Transaction" />
                {openTransaction ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTransaction} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/transaction/info"
                  selected={"/transaction/info" === path}
                >
                  <ListItemIcon><PermIdentityIcon /></ListItemIcon>
                  <ListItemText primary="Member Info" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  to="/transaction/search"
                  selected={"/transaction/search" === path}
                >
                  <ListItemIcon><AssessmentIcon /></ListItemIcon>
                  <ListItemText primary="A/C Search" />
                </ListItemButton>
                
              </List>
            </Collapse>

            <ListItem key="logout" disablePadding>
              <ListItemButton onClick={logoutUser}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>

          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
