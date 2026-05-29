import { React, useEffect, useState } from 'react';
import AxiosInstance from './AxiosInstance';
import { Box, Typography, Grid, Paper, Button, Card, CardContent, Avatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';

const Home = () => {
    const [stats, setStats] = useState({ total_members: 0, total_transactions: 0, total_revenue: 0 });
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        AxiosInstance.get('dashboard/stats/')
            .then((res) => {
                setStats(res.data);
            })
            .catch((err) => {
                console.error('Failed to fetch stats:', err);
            });
    }, []);

    const statCards = [
        { title: 'Total Members', value: stats.total_members, icon: <GroupIcon fontSize="large" />, color: '#6366f1' },
        { title: 'Total Revenue', value: `₹${stats.total_revenue}`, icon: <AttachMoneyIcon fontSize="large" />, color: '#10b981' },
        { title: 'Total Transactions', value: stats.total_transactions, icon: <ReceiptIcon fontSize="large" />, color: '#f59e0b' },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome Back, Admin 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening in your society today.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statCards.map((card, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <Card elevation={0} sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Avatar sx={{ bgcolor: card.color, width: 56, height: 56, mr: 3 }}>
                                    {card.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {card.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Quick Actions
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'primary.main',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : '#eff6ff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                        }}
                        onClick={() => navigate('/add-member')}
                    >
                        <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">Register New Member</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            Add a new resident or member to the society database.
                        </Typography>
                        <Button variant="contained" color="primary">Add Member</Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'secondary.main',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(236, 72, 153, 0.1)' : '#fdf2f8',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                        }}
                        onClick={() => navigate('/transaction/search')}
                    >
                        <SearchIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">Search Bills & Transactions</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            Look up existing members to add transactions or print receipts.
                        </Typography>
                        <Button variant="contained" color="secondary">Search Now</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
