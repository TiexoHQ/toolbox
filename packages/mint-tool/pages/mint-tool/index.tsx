import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../../components/mint-tool-page'), {
    ssr: false,
})

const HomePage = () => <DynamicComponentWithNoSSR />

export default HomePage
