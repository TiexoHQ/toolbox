import { ThemeProvider } from '@mui/material'
import { theme } from '../styles/themes/dark'
import '../styles/global'

export const themeProviderDecorator = (Story: any) => (
    <ThemeProvider theme={theme}>
        <Story />
    </ThemeProvider>
)
