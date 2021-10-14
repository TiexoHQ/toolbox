import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'

export default createUseStyle(() => {
    return {
        root: css`
            padding: 60px 30px 15px 30px;
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: #9696a0;
        `,
    }
})
