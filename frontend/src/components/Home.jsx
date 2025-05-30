import AxiosInstance from './AxiosInstance';
import { React, useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const Home = () => {
    const [myData, setMyData] = useState();
    const [loading, setLoading] = useState(true);
    const [nextId, setNextId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', gender: '', amount: '', stay_from: '', stay_to: '' });

    useEffect(() => {
        AxiosInstance.get('members/latest-id/')
            .then((res) => setNextId(res.data.next_id))
            .catch((err) => console.error('Failed to fetch latest ID:', err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const createdAt = new Date().toISOString();
        AxiosInstance.post('members/create/', {
            ...formData,
            member_id: nextId,
            created_at: createdAt,
        })
            .then(() => {
                alert('Member added successfully');
                setFormData({ name: '', email: '', phone: '', address: '', gender: '' });
                AxiosInstance.get('members/latest-id/')
                    .then((res) => setNextId(res.data.next_id));
            })
            .catch((err) => {
                console.error('Error saving member:', err);
                alert('Failed to add member');
            });
    };

    return (
        <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 ,mb:5}}>
            <Paper sx={{ p: 4, boxShadow: 6 }}>
                <Typography variant="h6" gutterBottom>
                    Add New Member
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Latest ID: {nextId ?? 'Loading...'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="phone"
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Gender as Radio Buttons */}
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        name="amount"
                        label="Amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        name="stay_from"
                        label="Stay From"
                        type="date"
                        value={formData.stay_from}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        name="stay_to"
                        label="Stay To"
                        type="date"
                        value={formData.stay_to}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />

                    {/* Centering the Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Member
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Home;
