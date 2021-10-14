import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import dynamic from 'next/dynamic'
import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import AttributesTab from './components/tabs/_attributes-tab'
import MixerTab from './components/tabs/_mixer-tab'
import PreviewTab from './components/tabs/_preview-tab'

import { useState, useRef, useEffect } from 'react'
import {
    INft,
    INftAttributesMap,
    INftGeneratorOptions,
} from 'packages/mint-tool/utils/nft-generator/types'
import { NftWorkerAction } from './types.worker'
import { klona } from 'klona/json'
import SettingsTab from './components/tabs/_settings-tab'
// import data from './_dummy'
import useStyle from './_index.style'
import { Typography } from '@mui/material'

const LoadCollectionNoSSR = dynamic(() => import('./components/_load-collection'), {
    ssr: false,
})

enum ScreenState {
    LOAD_FILES,
    MINT_TOOL,
}

enum MintTabs {
    ATTRIBUTES = 'ATTRIBUTES',
    MIXER = 'MIXER',
    SETTINGS = 'SETTINGS',
    PREVIEW = 'PREVIEW',
}

const Generator = () => {
    const style = useStyle()
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.LOAD_FILES)
    const [gDriveData, setGDriveData] = useState<IAttributesData>()
    const [selectedTab, setSelectedTab] = useState<MintTabs>(MintTabs.ATTRIBUTES)
    const [nftList, setNftList] = useState<INft[]>([])
    const workerRef = useRef<Worker>()
    const [generateInProgress, setGenerateInProgress] = useState<boolean>(false)

    useEffect(() => {
        workerRef.current = new Worker(new URL('./_nft.worker.ts', import.meta.url))
        workerRef.current.onmessage = evt => {
            if (
                evt?.data?.action?.type === NftWorkerAction.GENERATE &&
                evt?.data?.action?.data?.nftList
            ) {
                setNftList(evt.data.action.data.nftList)
                console.log(evt.data.action.data.nftList)
                setSelectedTab(MintTabs.PREVIEW)
                setTimeout(() => setGenerateInProgress(false), 500)
            }
        }
        return () => {
            workerRef.current?.terminate()
        }
    }, [])

    return (
        <div className={style.root}>
            {screenState === ScreenState.LOAD_FILES && (
                <LoadCollectionNoSSR
                    onCollectionLoaded={data => {
                        if (data) {
                            setGDriveData(data)
                            setScreenState(ScreenState.MINT_TOOL)
                        }
                    }}
                />
            )}

            {screenState === ScreenState.MINT_TOOL && (
                <>
                    <TabContext value={selectedTab}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            sx={{ flex: 1 }}
                        >
                            <Grid item xs="auto">
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h4">
                                        {gDriveData?.collectionName}
                                    </Typography>
                                    <Box sx={{ '& button': { m: 1 } }}>
                                        <Button
                                            disabled={generateInProgress}
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                const attributes: INftAttributesMap = {}
                                                for (const attribute of gDriveData?.attributes ||
                                                    []) {
                                                    attributes[
                                                        attribute.name
                                                    ] = attribute.values.map(v => v.name)
                                                    if (attribute.canMiss) {
                                                        attributes[attribute.name].unshift(
                                                            undefined
                                                        )
                                                    }
                                                }

                                                const options = JSON.parse(
                                                    localStorage.getItem(
                                                        `SETTINGS_KEY#${gDriveData?.collectionName}`
                                                    ) || '{}'
                                                )

                                                setGenerateInProgress(true)
                                                workerRef.current?.postMessage({
                                                    action: {
                                                        type: NftWorkerAction.GENERATE,
                                                        data: {
                                                            attributes,
                                                            options,
                                                        },
                                                    },
                                                })
                                            }}
                                        >
                                            {!generateInProgress && 'Generate'}
                                            {generateInProgress && (
                                                <>
                                                    <CircularProgress
                                                        thickness={5}
                                                        size={20}
                                                        variant="indeterminate"
                                                        sx={{ marginRight: 1 }}
                                                    />{' '}
                                                    Generating
                                                </>
                                            )}
                                        </Button>
                                    </Box>
                                    <Box sx={{ '& button': { m: 1 } }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setScreenState(ScreenState.LOAD_FILES)
                                                setGDriveData({} as any)
                                            }}
                                        >
                                            Load other
                                        </Button>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs="auto">
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        onChange={(e, newValue) => setSelectedTab(newValue)}
                                        aria-label="lab API tabs example"
                                    >
                                        <Tab label="Attributes" value={MintTabs.ATTRIBUTES} />
                                        <Tab label="Mixer" value={MintTabs.MIXER} />
                                        <Tab label="Settings" value={MintTabs.SETTINGS} />
                                        <Tab label="Preview" value={MintTabs.PREVIEW} />
                                    </TabList>
                                </Box>
                            </Grid>
                            <Grid item xs={true} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <TabPanel
                                    value={MintTabs.ATTRIBUTES}
                                    sx={{ flex: selectedTab === MintTabs.ATTRIBUTES ? 1 : 0 }}
                                >
                                    <AttributesTab
                                        data={gDriveData}
                                        onDataUpdate={data => {
                                            setGDriveData(data)
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel
                                    value={MintTabs.MIXER}
                                    sx={{
                                        flex: selectedTab === MintTabs.MIXER ? 1 : 0,
                                        display: selectedTab === MintTabs.MIXER ? 'flex' : 'none',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <MixerTab attributesData={gDriveData || ({} as any)} />
                                </TabPanel>
                                <TabPanel
                                    value={MintTabs.SETTINGS}
                                    sx={{ flex: selectedTab === MintTabs.SETTINGS ? 1 : 0 }}
                                >
                                    <SettingsTab attributesData={gDriveData || ({} as any)} />
                                </TabPanel>
                                <TabPanel
                                    value={MintTabs.PREVIEW}
                                    sx={{ flex: selectedTab === MintTabs.PREVIEW ? 1 : 0 }}
                                >
                                    <PreviewTab
                                        nftList={nftList}
                                        attributesData={gDriveData || ({} as any)}
                                    />
                                </TabPanel>
                            </Grid>
                        </Grid>
                    </TabContext>
                </>
            )}
        </div>
    )
}

export default Generator

const OPTIONS: INftGeneratorOptions = {
    maxTries: 9000,
    randomSeed: 1234567890,

    nftCount: 21,
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
                rarityScore: { min: 0, max: Infinity },
                attributesCount: { min: 4, max: 9 },
                nftCount: 5000,
            },
        ],
        attributesValuesOccurences: {
            '*': { '*': { min: 1, max: 50 } },
        },
    },
}
