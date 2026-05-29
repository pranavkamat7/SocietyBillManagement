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
import IconButton from '@mui/material/IconButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';
import { ThemeContext } from '../theme/ThemeContext';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 260;

export default function Navbar(props) {
  const { content } = props;
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = React.useContext(ThemeContext);

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

  React.useEffect(() => {
    if (path.startsWith("/transaction")) {
      setOpenTransaction(true);
    }
  }, [path]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ✨ Society Manager
            </Typography>
          </Box>
          
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List sx={{ px: 2 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to="/home" 
                selected={"/home" === path}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><DashboardIcon color={path === "/home" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: path === "/home" ? 600 : 400 }}/>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to="/members" 
                selected={"/members" === path}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><GroupIcon color={path === "/members" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Member List" primaryTypographyProps={{ fontWeight: path === "/members" ? 600 : 400 }}/>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton onClick={handleTransactionClick} sx={{ borderRadius: 2 }}>
                <ListItemIcon><ReceiptIcon color={path.startsWith("/transaction") ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Transactions" primaryTypographyProps={{ fontWeight: path.startsWith("/transaction") ? 600 : 400 }}/>
                {openTransaction ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={openTransaction} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                <ListItemButton
                  sx={{ borderRadius: 2, mb: 0.5 }}
                  component={Link}
                  to="/transaction/info"
                  selected={"/transaction/info" === path}
                >
                  <ListItemIcon><PermIdentityIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Member Info" />
                </ListItemButton>
                <ListItemButton
                  sx={{ borderRadius: 2, mb: 0.5 }}
                  component={Link}
                  to="/transaction/search"
                  selected={"/transaction/search" === path}
                >
                  <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="A/C Search" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          
          <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, color: 'error.main' }}>
                  <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
