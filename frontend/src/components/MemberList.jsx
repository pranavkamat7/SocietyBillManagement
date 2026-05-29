import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Group as GroupIcon } from '@mui/icons-material';
import AxiosInstance from './AxiosInstance';
import toast from 'react-hot-toast';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const fetchMembers = () => {
        AxiosInstance.get('members/all/')
            .then(res => setMembers(res.data))
            .catch(err => toast.error('Failed to load members'));
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // --- Delete Handlers ---
    const handleDeleteClick = (member) => {
        setSelectedMember(member);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        AxiosInstance.delete(`members/delete/${selectedMember.member_id}/`)
            .then(() => {
                toast.success('Member deleted successfully');
                setDeleteModalOpen(false);
                fetchMembers();
            })
            .catch(() => toast.error('Failed to delete member'));
    };

    // --- Edit Handlers ---
    const handleEditClick = (member) => {
        setSelectedMember({ ...member });
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setSelectedMember({ ...selectedMember, [e.target.name]: e.target.value });
    };

    const saveEdit = () => {
        AxiosInstance.put(`members/update/${selectedMember.member_id}/`, selectedMember)
            .then(() => {
                toast.success('Member updated successfully');
                setEditModalOpen(false);
                fetchMembers();
            })
            .catch(() => toast.error('Failed to update member'));
    };

    return (
        <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <GroupIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        All Society Members
                    </Typography>
                </Box>

                <Table sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.member_id} hover>
                                <TableCell>#{member.member_id}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit Member">
                                        <IconButton color="primary" onClick={() => handleEditClick(member)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Member">
                                        <IconButton color="error" onClick={() => handleDeleteClick(member)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {members.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No members found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <strong>{selectedMember?.name}</strong>? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogContent dividers>
                    {selectedMember && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Name" name="name" value={selectedMember.name} onChange={handleEditChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Email" name="email" value={selectedMember.email} onChange={handleEditChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Phone" name="phone" value={selectedMember.phone} onChange={handleEditChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Address" name="address" value={selectedMember.address} onChange={handleEditChange} multiline rows={2} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Stay From" type="date" name="stay_from" value={selectedMember.stay_from} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Stay To" type="date" name="stay_to" value={selectedMember.stay_to || ''} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button onClick={saveEdit} color="primary" variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MemberList;
