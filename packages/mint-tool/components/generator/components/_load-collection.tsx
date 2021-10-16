import { Stack } from '@mui/material'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import useEffectAsync from '@tiexohq/marketplace-common/ui/hooks/use-effect-async'
import {
    getAttributesData,
    IAttributesData,
} from 'packages/mint-tool/components/mint-tool-page/data'
import React, { useState } from 'react'
import useDrivePicker from 'react-google-drive-picker/dist'
import { testData } from 'packages/mint-tool/utils/_test-data'

// const worker = new Worker('/worker.js')
// worker.onmessage = e => console.log('worker message', e.data)

enum ScreenState {
    DEFAULT,
    LOADING,
}

interface ILoadCollection {
    onCollectionLoaded: (data: IAttributesData) => void
}

const LoadCollection = ({ onCollectionLoaded }: ILoadCollection) => {
    const [openPicker, drivePickerData] = useDrivePicker()
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.DEFAULT)

    useEffectAsync(async () => {
        // do anything with the selected/uploaded files
        if (drivePickerData && drivePickerData.action === 'picked') {
            // load data and put it in state
            setScreenState(ScreenState.LOADING)
            // get attributes data
            const data = await getAttributesData(drivePickerData.docs[0].id)
            onCollectionLoaded(data)
            setScreenState(ScreenState.DEFAULT)
        }
    }, [drivePickerData])

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%', flex: 1 }}
        >
            <Grid item>
                {screenState === ScreenState.LOADING && (
                    <CircularProgress variant="indeterminate" />
                )}
                {screenState === ScreenState.DEFAULT && (
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            onClick={() => {
                                openPicker({
                                    clientId: process.env.NEXT_PUBLIC_GAPI_APP_CLIENT || '',
                                    developerKey: process.env.NEXT_PUBLIC_GAPI_API_KEY || '',
                                    viewId: 'FOLDERS',
                                    showUploadView: true,
                                    showUploadFolders: true,
                                    setSelectFolderEnabled: true,
                                    supportDrives: true,
                                    multiselect: true,
                                })
                            }}
                        >
                            {'Open using GDrive'}
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            onClick={() => onCollectionLoaded(testData)}
                        >
                            {'Open test project'}
                        </Button>
                    </Stack>
                )}
            </Grid>
        </Grid>
    )
}

export default LoadCollection
