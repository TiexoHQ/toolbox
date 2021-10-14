import useStyle from './style'

import Img from '@tiexohq/marketplace-common/ui/components/img'

const Header = () => {
    const style = useStyle()
    return (
        <header className={style.header}>
            <Img className={style.logo} src="/tiexo.svg" />
            <nav>
                {/* <Link href="/">
                    Home
                </Link>
                <Link href="/mint-tool">
                    Mint
                </Link> */}
            </nav>
        </header>
    )
}

export default Header
