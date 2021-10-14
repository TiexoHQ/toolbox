import { createTheme, Theme } from '@mui/material'

export const theme: Theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#75fcc6',
        },
        secondary: {
            main: '#ffe710',
        },
        background: {
            paper: '#3f4c54',
            default: '#292a31',
        },
        error: {
            main: '#F8877F',
        },
        grey: {
            50: '#3f4c54',
            100: '#e1e1e1',
            200: '#4A4B57',
            500: '#292a31',
            900: '#21272d',
        },
    },
    typography: {
        fontFamily: 'Roboto',
    },

    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#75fcc6',
                },
            },
        },
    },
})
