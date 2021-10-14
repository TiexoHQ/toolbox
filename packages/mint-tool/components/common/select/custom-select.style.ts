import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'
import { Theme } from '@mui/material/styles/createTheme'

export default createUseStyle((theme: Theme) => ({
    customSelect: css`
        margin: 7px 0px;
        min-width: 150px;
    `,
}))
