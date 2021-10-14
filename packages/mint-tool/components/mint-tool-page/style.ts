import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'

export default createUseStyle(() => {
    return {
        root: css`
            padding-top: 60px;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            height: 100%;
            justify-content: space-between;
        `,
        imageContainer: css`
            position: fixed;
            margin-top: 60px;
            top: 3%;
            left: 3%;
            right: 420px;
            bottom: 3%;

            img {
                position: absolute;
                max-width: 100%;
                max-height: 100%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        `,
        layersController: css`
            background-color: transparent;
            padding: 20px;
            margin: 20px;
            flex-shrink: 0;
            width: 360px;

            .MuiDrawer-paper {
                width: 360px;
                overflow: hidden;
                position: absolute;
                height: auto;
                box-sizing: border-box;
                padding-top: 90px;
                background-color: transparent;
                border: none;
                margin: 0 20px;
                z-index: 10;
                padding-bottom: 140px;
            }
        `,
        loadButton: css`
            margin: 10px;
            width: 344px;
            height: 56px;
            margin-top: 50px !important;
        `,
        drawerFooter: css`
            position: fixed;
            bottom: 0;
            width: 360px;
            height: 137px;
            z-index: 1;
            background: #292a31;
            text-align: center;
        `,
        loadFiles: css`
            margin: auto;
            text-align: center;
            padding-top: 250px;

            p {
                color: #e1e1e3;
            }
        `,
    }
})
