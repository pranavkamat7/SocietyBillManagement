import React, { useState } from 'react';
import {
    TextField, Button, Box, Typography,
    Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import AxiosInstance from './AxiosInstance';
import toast from 'react-hot-toast';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const MemberInfo = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        if (!query.trim()) {
            toast.error('Please enter a name or email');
            return;
        }

        const loadingToast = toast.loading('Searching...');
        AxiosInstance.get(`members/info/?query=${query}`)
            .then((res) => {
                if (res.data.length === 0) {
                    toast.error('No members found', { id: loadingToast });
                } else {
                    toast.success(`Found ${res.data.length} members`, { id: loadingToast });
                }
                setResults(res.data);
            })
            .catch(() => {
                setResults([]);
                toast.error('Error searching members', { id: loadingToast });
            });
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 3, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonSearchIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Search Member by Name or Email
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    If you don't know the exact Member ID, you can search by their name or email address.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        label="Name or Email"
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch} sx={{ px: 4 }}>
                        Search
                    </Button>
                </Box>

                {results.length > 0 && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                        <Table sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell><strong>Member ID</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((member, idx) => (
                                    <TableRow key={member.member_id} hover>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            #{member.member_id}
                                        </TableCell>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default MemberInfo;
