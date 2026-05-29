import {React, useState} from 'react'
import { Box, Paper, Typography, Link as MuiLink } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {Link as RouterLink} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import AxiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'

const Login = () => {
    const navigate = useNavigate()
    const {handleSubmit, control} = useForm()

    const submission = (data) => {
        const loadingToast = toast.loading('Signing in...')
        AxiosInstance.post(`login/`,{
            email: data.email, 
            password: data.password,
        })
        .then((response) => {
            toast.success('Logged in successfully!', { id: loadingToast })
            localStorage.setItem('Token', response.data.token)
            navigate(`/home`)
        })
        .catch((error) => {
            toast.error('Login failed. Please check your credentials.', { id: loadingToast })
            console.error('Error during login', error)
        })
    }
    
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            p: 2
        }}>
            <Paper elevation={10} sx={{
                p: { xs: 4, sm: 6 },
                width: '100%',
                maxWidth: 450,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper'
            }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <LockOutlinedIcon fontSize="large" />
                </Avatar>
                
                <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                    Welcome Back
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    Enter your credentials to access the Society Manager.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(submission)} sx={{ width: '100%' }}>
                    <Box sx={{ mb: 3 }}>
                        <MyTextField label="Email Address" name="email" control={control} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <MyPassField label="Password" name="password" control={control} />
                    </Box>

                    <MyButton label="Sign In" type="submit" />

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                        <MuiLink component={RouterLink} to="/register" variant="body2" color="primary">
                            Don't have an account? Sign Up
                        </MuiLink>
                        <MuiLink component={RouterLink} to="/request/password_reset" variant="body2" color="text.secondary">
                            Forgot your password?
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default Login