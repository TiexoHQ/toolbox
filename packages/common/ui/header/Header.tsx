import React from 'react'
import Img from '../components/img'
import styles from './style'

const Header: React.FC = props => {
    const style = styles()
    return (
        <header className={style.header}>
            <Img width={96} height={25} src={'/tiexo-logo.svg'} />
            {props.children}
        </header>
    )
}

export default Header
