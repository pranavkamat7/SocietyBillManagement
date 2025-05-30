import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Typography,
    Table, TableHead, TableRow, TableCell,
    TableBody, Paper, MenuItem
} from '@mui/material';
import AxiosInstance from './AxiosInstance';
import dayjs from 'dayjs';

const MemberSearch = () => {
    const [searchId, setSearchId] = useState('');
    const [memberData, setMemberData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    const [newTransaction, setNewTransaction] = useState({
        date: '',
        payment_method: 'Cash',
        amount_paid: ''
    });

    const handleSearch = () => {
        AxiosInstance.get(`members/search/${searchId}/`)
            .then((res) => {
                const member = res.data.member;
                const txs = res.data.transactions;
                setMemberData(member);
                setTransactions(txs);
                setError('');

                // Calculate default transaction date
                let defaultDate;
                if (txs.length > 0) {
                    const latestDate = dayjs(txs[0].date); // assuming sorted descending
                    defaultDate = latestDate.add(1, 'month').startOf('month');
                } else {
                    defaultDate = dayjs(member.start_date);
                }

                setNewTransaction({
                    date: defaultDate.format('YYYY-MM-DD'),
                    payment_method: 'Cash',
                    amount_paid: member.amount
                });
            })
            .catch((err) => {
                setError('Member not found');
                setMemberData(null);
                setTransactions([]);
            });
    };

    const handleTransactionChange = (e) => {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };

    const handleAddTransaction = () => {
        AxiosInstance.post('transactions/create/', {
            member: memberData.member_id,  // Ensure this is the correct key based on backend expectations
            date: newTransaction.date,
            payment_method: newTransaction.payment_method,
            amount_paid: newTransaction.amount_paid
        })
            .then(() => {
                alert('Transaction added!');
                handleSearch(); // re-fetch data
            })
            .catch(() => alert('Failed to add transaction'));
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5  }}>
            <Paper sx={{ p: 4 , boxShadow: 6}}>
                <Typography variant="h6">Search Member by ID</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
                    <TextField
                        label="Member ID"
                        type="number"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                </Box>

                {error && <Typography color="error">{error}</Typography>}

                {memberData && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1"><strong>Name:</strong> {memberData.name}</Typography>
                        <Typography variant="subtitle1"><strong>Phone:</strong> {memberData.phone}</Typography>
                        <Typography variant="subtitle1"><strong>Address:</strong> {memberData.address}</Typography>
                        <Typography variant="subtitle1"><strong>Staying From:</strong> {memberData.stay_from}<strong> To: </strong> {memberData.stay_to}</Typography>

                        <Box sx={{ mt: 3, mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" gutterBottom><strong>Add New Transaction</strong></Typography>
                            <TextField
                                label="Date"
                                type="date"
                                name="date"
                                value={newTransaction.date}
                                onChange={handleTransactionChange}
                                sx={{ mr: 2, mb: 2 }}
                            />
                            <TextField
                                select
                                label="Payment Method"
                                name="payment_method"
                                value={newTransaction.payment_method}
                                onChange={handleTransactionChange}
                                sx={{ mr: 2, mb: 2 }}
                            >
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="UPI">UPI</MenuItem>
                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                            </TextField>
                            <TextField
                                label="Amount Paid"
                                name="amount_paid"
                                type="number"
                                value={newTransaction.amount_paid}
                                onChange={handleTransactionChange}
                                sx={{ mr: 2, mb: 2 }}
                            />
                            <Button variant="contained" onClick={handleAddTransaction}>Paid</Button>
                        </Box>
                    </Box>
                )}

                {transactions.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Amount Paid</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...transactions].sort((a, b) => new Date(a.date) - new Date(b.date)).map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell>{tx.payment_method}</TableCell>
                                    <TableCell>₹{tx.amount_paid}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );
};

export default MemberSearch;
