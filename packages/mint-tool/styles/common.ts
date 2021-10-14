import { css } from '@emotion/css'
import { Theme } from '@mui/material'
import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'

export default createUseStyle((theme: Theme) => ({
    borderWrapper: css`
        border: 1px solid ${theme.palette.grey[200]};
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        box-shadow: 0 5px 10px rgb(8 8 8 / 0.5);
    `,

    shadowItem: css`
        box-shadow: 0 5px 10px rgb(8 8 8 / 0.9);
        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;
        border: 2px solid ${theme.palette.grey[200]};
    `,
}))
