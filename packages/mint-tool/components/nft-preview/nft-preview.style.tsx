import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'

export default createUseStyle(() => {
    return {
        root: css`
            background-image: url(/transparent-bg.svg);
            background-repeat: repeat;
            background-size: 20px;
            position: relative;
            display: inline-block;
        `,
        image: css`
            display: block;
            max-width: 100%;
            max-height: 100%;
            top: 0;
            left: 0;
            /* left: 50%;
            top: 50%;
            transform: translate(-50%, -50%); */
        `,
        absolute: css`
            position: absolute;
        `,
    }
})
