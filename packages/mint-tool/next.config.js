/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['gapi-script']) // pass the modules you would like to see transpiled

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withTM(
    withBundleAnalyzer({
        reactStrictMode: true,
        experimental: {
            externalDir: true,
        },
    })
)
