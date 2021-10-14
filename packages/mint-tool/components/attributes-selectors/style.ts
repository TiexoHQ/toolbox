import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'

export default createUseStyle(() => ({
    root: css``,
    button: css`
        width: 37px !important;
        min-width: 37px !important;
        margin-top: 10px;
    `,
    checkbox: css`
        margin-top: 8px;
    `,
}))
