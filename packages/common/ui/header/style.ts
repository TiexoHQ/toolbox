import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'
import { Theme } from '@mui/material/styles/createTheme'

export default createUseStyle((theme: Theme) => ({
    header: css`
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 76px;
        padding: 0;
        background: ${theme.palette.background.default};
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        z-index: 50;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        nav a {
            display: inline-block;
            height: 56px;
            line-height: 56px;
            padding: 0 15px;
            min-width: 50px;
            text-align: center;
            text-decoration: none;
            color: ${theme.palette.grey[100]};
            margin: 0px 10px;
            border: 1px solid transparent;
        }

        button {
            height: 40px;
            background: ${theme.palette.primary.main};
        }

        nav a:hover {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }

        .activeTab {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid ${theme.palette.primary.main} !important;
            border-radius: 4px;
        }
    `,
}))
