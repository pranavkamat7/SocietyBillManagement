import { Box, Paper, Typography, Link as MuiLink } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {Link as RouterLink} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import AxiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast from 'react-hot-toast'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import Avatar from '@mui/material/Avatar'

const Register = () => {
    const navigate = useNavigate()

    const schema = yup.object({
        email: yup.string().email('Field expects an email adress').required('Email is a required field'),
        password: yup.string()
                    .required('Password is a required field')
                    .min(8,'Password must be at least 8 characters')
                    .matches(/[A-Z]/,'Password must contain at least one uppercase letter')
                    .matches(/[a-z]/,'Password must contain at least one lower case letter')
                    .matches(/[0-9]/,'Password must contain at least one number')
                    .matches(/[!@#$%^&*(),.?":;{}|<>+]/, 'Password must contain at least one special character'),
        password2: yup.string().required('Password confirmation is a required field')
                     .oneOf([yup.ref('password'),null], 'Passwords must match')
    })  

    const {handleSubmit, control} = useForm({resolver: yupResolver(schema)})

    const submission = (data) => {
        const loadingToast = toast.loading('Creating account...')
        AxiosInstance.post(`register/`,{
            email: data.email, 
            password: data.password,
        })
        .then(() => {
            toast.success('Registration successful! Please login.', { id: loadingToast })
            navigate(`/`)
        })
        .catch((error) => {
            toast.error('Registration failed.', { id: loadingToast })
            console.error(error)
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <PersonAddAlt1Icon fontSize="large" />
                </Avatar>
                
                <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                    Create Account
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    Join Society Manager to streamline your billing process.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(submission)} sx={{ width: '100%' }}>
                    <Box sx={{ mb: 3 }}>
                        <MyTextField label="Email Address" name="email" control={control} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <MyPassField label="Password" name="password" control={control} />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <MyPassField label="Confirm Password" name="password2" control={control} />
                    </Box>

                    <MyButton label="Sign Up" type="submit" />

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <MuiLink component={RouterLink} to="/" variant="body2" color="primary">
                            Already have an account? Sign in
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default Register