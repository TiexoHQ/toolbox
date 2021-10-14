const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path')
const toPath = filePath => path.join(process.cwd(), filePath)

module.exports = {
    webpackFinal: config => {
        config.resolve.plugins = [
            ...(config.resolve.plugins || []),
            new TsconfigPathsPlugin({
                extensions: config.resolve.extensions,
            }),
        ]
        // custom theme was not picked: https://github.com/mui-org/material-ui/issues/24282
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                },
            },
        }
    },
    stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
}
