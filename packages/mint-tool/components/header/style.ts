import { createUseStyle } from '@tiexohq/marketplace-common/ui/hooks/theme'
import { css } from '@emotion/css'

export default createUseStyle({
    header: css`
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 56px;
        padding: 0;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        z-index: 50;
        background: #292a31;

        h1 {
            float: left;
            margin: 0;
            padding: 0 15px;
            font-size: 24px;
            line-height: 56px;
            font-weight: 400;
            color: #fff;
        }

        nav {
            float: right;
            font-size: 100%;
        }

        nav a {
            display: inline-block;
            height: 56px;
            line-height: 56px;
            padding: 0 15px;
            min-width: 50px;
            text-align: center;
            background: rgba(255, 255, 255, 0);
            text-decoration: none;
            color: #fff;
            will-change: background-color;
        }

        nav a:hover,
        nav a:active {
            background: rgba(0, 0, 0, 0.2);
        }

        nav a.active {
            background: rgba(0, 0, 0, 0.4);
        }
    `,
    logo: css`
        margin: 16px;
    `,
})
