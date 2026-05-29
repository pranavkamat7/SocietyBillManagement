import AxiosInstance from './AxiosInstance';
import { React, useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
    const [nextId, setNextId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', gender: 'male', amount: '', stay_from: '', stay_to: '' });
    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get('members/latest-id/')
            .then((res) => setNextId(res.data.next_id))
            .catch((err) => {
                console.error('Failed to fetch latest ID:', err);
                toast.error('Failed to fetch member ID');
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const createdAt = new Date().toISOString();
        const loadingToast = toast.loading('Adding member...');

        AxiosInstance.post('members/create/', {
            ...formData,
            member_id: nextId,
            created_at: createdAt,
        })
            .then(() => {
                toast.success('Member added successfully!', { id: loadingToast });
                setFormData({ name: '', email: '', phone: '', address: '', gender: 'male', amount: '', stay_from: '', stay_to: '' });
                AxiosInstance.get('members/latest-id/')
                    .then((res) => setNextId(res.data.next_id));
                // navigate back to home after successful add
                setTimeout(() => navigate('/home'), 1000);
            })
            .catch((err) => {
                console.error('Error saving member:', err);
                toast.error('Failed to add member', { id: loadingToast });
            });
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 3, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonAddIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Add New Member
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Registering member with ID: <strong>{nextId ?? 'Loading...'}</strong>
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="address" label="Address" value={formData.address} onChange={handleChange} />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Gender</FormLabel>
                                <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
                                    <FormControlLabel value="male" control={<Radio color="primary" />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio color="secondary" />} label="Female" />
                                    <FormControlLabel value="other" control={<Radio color="default" />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField fullWidth name="amount" label="Initial Amount" type="number" value={formData.amount} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth name="stay_from" label="Stay From" type="date" value={formData.stay_from} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth name="stay_to" label="Stay To" type="date" value={formData.stay_to} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/home')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large">
                            Save Member
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AddMember;
