import React, { useEffect, useState } from 'react'
import { Routes } from '../../utils/constants'

const NavigationMenu: React.FC = () => {
    const [activeRoute, setActiveRoute] = useState<Routes | undefined>(undefined)

    useEffect(() => {
        setActiveRoute((window?.location?.pathname as Routes) || Routes.home)
    }, [])

    const extractProps = (route: Routes) => {
        let props: Record<string, string> = {
            href: route,
        }

        if (activeRoute === route) {
            props = {
                ...props,
                className: 'activeTab',
            }
        }
        return props
    }
    return (
        <nav>
            <a {...extractProps(Routes.home)}>Home</a>
            <a {...extractProps(Routes.marketplace)}>Marketplace</a>
            <a {...extractProps(Routes.ntfs)}>My NFTs</a>
            <a {...extractProps(Routes.swap)}>Swap</a>
            <a {...extractProps(Routes.stake)}>Stake</a>
            <a {...extractProps(Routes.helpCenter)}>Help Center</a>
        </nav>
    )
}

export default NavigationMenu
