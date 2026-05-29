import React, { useState } from 'react';
import {
    TextField, Button, Box, Typography,
    Table, TableHead, TableRow, TableCell,
    TableBody, Paper, MenuItem, Grid, Card, CardContent, Divider, IconButton
} from '@mui/material';
import AxiosInstance from './AxiosInstance';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';
import AddCardIcon from '@mui/icons-material/AddCard';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';

const MemberSearch = () => {
    const [searchId, setSearchId] = useState('');
    const [memberData, setMemberData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    const [newTransaction, setNewTransaction] = useState({
        date: '',
        payment_method: 'Cash',
        amount_paid: ''
    });

    const handleSearch = () => {
        const loadingToast = toast.loading('Searching...');
        AxiosInstance.get(`members/search/${searchId}/`)
            .then((res) => {
                const member = res.data.member;
                const txs = res.data.transactions;
                setMemberData(member);
                setTransactions(txs);
                toast.success('Member found', { id: loadingToast });

                // Calculate default transaction date
                let defaultDate;
                if (txs.length > 0) {
                    const latestDate = dayjs(txs[0].date);
                    defaultDate = latestDate.add(1, 'month').startOf('month');
                } else {
                    defaultDate = dayjs(member.start_date || member.stay_from);
                }

                setNewTransaction({
                    date: defaultDate.format('YYYY-MM-DD'),
                    payment_method: 'Cash',
                    amount_paid: member.amount
                });
            })
            .catch((err) => {
                toast.error('Member not found', { id: loadingToast });
                setMemberData(null);
                setTransactions([]);
            });
    };

    const handleTransactionChange = (e) => {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };

    const handleAddTransaction = () => {
        const loadingToast = toast.loading('Recording payment...');
        AxiosInstance.post('transactions/create/', {
            member: memberData.member_id,
            date: newTransaction.date,
            payment_method: newTransaction.payment_method,
            amount_paid: newTransaction.amount_paid
        })
            .then(() => {
                toast.success('Transaction added successfully!', { id: loadingToast });
                handleSearch(); // re-fetch data
            })
            .catch(() => toast.error('Failed to add transaction', { id: loadingToast }));
    };

    const downloadReceipt = (tx) => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241); // Indigo primary
        doc.text("Society Manager", 105, 20, null, null, "center");
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Payment Receipt", 105, 30, null, null, "center");
        
        doc.setFontSize(12);
        doc.text(`Receipt ID: TXN-${tx.id || Math.floor(Math.random()*1000)}`, 20, 50);
        doc.text(`Date: ${tx.date}`, 20, 60);
        
        doc.setLineWidth(0.5);
        doc.line(20, 65, 190, 65);
        
        doc.text(`Received from: ${memberData.name}`, 20, 80);
        doc.text(`Member ID: ${memberData.member_id}`, 20, 90);
        
        doc.text(`Amount Paid: Rs. ${tx.amount_paid}`, 20, 110);
        doc.text(`Payment Method: ${tx.payment_method}`, 20, 120);
        
        doc.line(20, 130, 190, 130);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for your payment.", 105, 140, null, null, "center");
        
        doc.save(`Receipt_${memberData.name}_${tx.date}.pdf`);
        toast.success("Receipt downloaded!");
    };

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 3, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SearchIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Search Member & Transactions
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 4 }}>
                    <TextField
                        label="Enter Member ID"
                        type="number"
                        variant="outlined"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch} sx={{ px: 4 }}>
                        Search
                    </Button>
                </Box>

                {memberData && (
                    <Box sx={{ mb: 4, animation: 'fadeIn 0.5s' }}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom>Member Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>Name:</strong> {memberData.name}</Typography>
                                        <Typography variant="body1"><strong>Phone:</strong> {memberData.phone}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>Address:</strong> {memberData.address}</Typography>
                                        <Typography variant="body1"><strong>Stay:</strong> {memberData.stay_from} to {memberData.stay_to}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, border: '1px dashed', borderColor: 'primary.main', mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AddCardIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Record New Payment</Typography>
                            </Box>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Date" type="date" name="date" value={newTransaction.date} onChange={handleTransactionChange} InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth select label="Payment Method" name="payment_method" value={newTransaction.payment_method} onChange={handleTransactionChange}>
                                        <MenuItem value="Cash">Cash</MenuItem>
                                        <MenuItem value="UPI">UPI</MenuItem>
                                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Amount Paid" name="amount_paid" type="number" value={newTransaction.amount_paid} onChange={handleTransactionChange} />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth variant="contained" color="secondary" onClick={handleAddTransaction} size="large">
                                        Mark as Paid
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                )}

                {transactions.length > 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Transaction History</Typography>
                        <Table sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Payment Method</strong></TableCell>
                                    <TableCell><strong>Amount</strong></TableCell>
                                    <TableCell align="right"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((tx, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>{tx.payment_method}</TableCell>
                                        <TableCell>₹{tx.amount_paid}</TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                startIcon={<DownloadIcon />}
                                                onClick={() => downloadReceipt(tx)}
                                            >
                                                Receipt
                                            </Button>
                                        </TableCell>
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

export default MemberSearch;
