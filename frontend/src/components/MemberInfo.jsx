import React, { useState } from 'react';
import {
    TextField, Button, Box, Typography,
    Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import AxiosInstance from './AxiosInstance';

const MemberInfo = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = () => {
        AxiosInstance.get(`members/info/?query=${query}`)
            .then((res) => {
                setResults(res.data);
                setError('');
            })
            .catch(() => {
                setResults([]);
                setError('No members found');
            });
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Paper sx={{ p: 4, boxShadow: 6 }}>
                <Typography variant="h6">Search Member by Name or Email</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
                    <TextField
                        label="Name or Email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                </Box>

                {error && <Typography color="error">{error}</Typography>}

                {results.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Member ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((member) => (
                                <TableRow key={member.member_id}>
                                    <TableCell>{member.member_id}</TableCell>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );
};

export default MemberInfo;
