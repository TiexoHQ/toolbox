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
} from 'packages/mint-tool/utils/nft-generator/types'
import React, { useEffect, useState } from 'react'

const SETTINGS_KEY = 'SETTINGS_KEY'
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
            `${SETTINGS_KEY}#${props.attributesData.collectionName}`
        )
        if (savedSettings) {
            setOptions(JSON.parse(savedSettings) as INftGeneratorOptions)
        }
        console.log('read from storage')
    }, [])

    console.log(options)

    const setLocalOptions = (options: INftGeneratorOptions) => {
        setOptions(options)
        localStorage.setItem(
            `${SETTINGS_KEY}#${props.attributesData.collectionName}`,
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

const demoSettings: INftGeneratorOptions = {
    maxTries: 100000,
    randomSeed: 1234567890,
    nftCount: 100,
    attributesCompatibility: [
        {
            type: 'deny',
            condition: {
                or: [
                    { and: [{ attributes: { Visor: '*' } }, { attributes: { Head: '*' } }] },
                    {
                        and: [
                            { attributes: { Visor: 'undefined' } },
                            { attributes: { Head: 'undefined' } },
                        ],
                    },
                ],
            },
        },
    ],
    targets: {
        rarity: [
            {
                nftCount: 100,
                rarityScore: {
                    min: 1,
                    max: 99999999,
                },
                attributesCount: {
                    min: 4,
                    max: 7,
                },
            },
        ],
        attributesValuesOccurences: {
            Hair: { 'Red-Roman.png': { min: 1, max: 1 }, '*': { min: 1, max: 2 } },
            '*': { '*': { min: 1, max: 50 } },
        },
    },
}

export default SettingsTab
