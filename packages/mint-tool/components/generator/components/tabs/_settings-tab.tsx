import { TabContext, TabPanel } from '@mui/lab'
import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import { Box } from '@mui/system'
import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'
import EditCapabilities from 'packages/mint-tool/components/settings-tab/capabilities/edit-capabilities'
import EditSettings from 'packages/mint-tool/components/settings-tab/general/edit-settings'
import styles from 'packages/mint-tool/components/settings-tab/settings.style'
import EditTargets from 'packages/mint-tool/components/settings-tab/targets/edit-targets'
import {
    INftGeneratorAttributesCompatibility,
    INftGeneratorOptions,
    ITargetType,
    StorageKeys,
} from 'packages/mint-tool/utils/nft-generator/types'
import React, { useEffect, useState } from 'react'
import { demoSettings } from 'packages/mint-tool/utils/_test-data'

interface ISettingsTab {
    attributesData: IAttributesData
}

enum Settingstab {
    GENERAL = 'GENERAL',
    COMPATIBILITY = 'COMPATIBILITY',
    TARGET = 'TARGET',
}

const SettingsTab: React.FC<ISettingsTab> = (props: ISettingsTab) => {
    const style = styles()
    const [tab, setTab] = useState(Settingstab.GENERAL)
    const [options, setOptions] = useState<INftGeneratorOptions>(demoSettings)

    useEffect(() => {
        const savedSettings = localStorage.getItem(
            `${StorageKeys.SETTINGS_KEY}#${props.attributesData.collectionName}`
        )
        if (savedSettings) {
            setOptions(JSON.parse(savedSettings) as INftGeneratorOptions)
        }
    }, [])

    console.log(options)

    const setLocalOptions = (options: INftGeneratorOptions) => {
        setOptions(options)
        localStorage.setItem(
            `${StorageKeys.SETTINGS_KEY}#${props.attributesData.collectionName}`,
            JSON.stringify(options)
        )
    }

    const onChangeGeneralSettings = (value: number, key: keyof INftGeneratorOptions) => {
        setLocalOptions({
            ...options,
            [key]: value,
        })
    }

    const onChangeCapabilities = (
        attributesCompatibility: INftGeneratorAttributesCompatibility[]
    ) => {
        setLocalOptions({
            ...options,
            attributesCompatibility,
        })
    }

    const onChangetargets = (targets: ITargetType) => {
        setLocalOptions({
            ...options,
            targets,
        })
    }
    return (
        <div>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs onChange={(e, newValue) => setTab(newValue)} value={tab}>
                        <Tab label="General" value={Settingstab.GENERAL} />
                        <Tab label="Compability" value={Settingstab.COMPATIBILITY} />
                        <Tab label="Targets" value={Settingstab.TARGET} />
                    </Tabs>
                </Box>

                <TabPanel value={Settingstab.GENERAL} className={style.tab}>
                    <EditSettings options={options} onChange={onChangeGeneralSettings} />
                </TabPanel>

                <TabPanel value={Settingstab.COMPATIBILITY} className={style.tab}>
                    <EditCapabilities
                        attrCompatibility={options.attributesCompatibility}
                        onChange={onChangeCapabilities}
                        attributesData={props.attributesData}
                    />
                </TabPanel>
                <TabPanel value={Settingstab.TARGET} className={style.tab}>
                    <EditTargets
                        targets={options.targets}
                        onChange={onChangetargets}
                        attributes={props.attributesData.attributes}
                    />
                </TabPanel>
            </TabContext>
        </div>
    )
}

export default SettingsTab
