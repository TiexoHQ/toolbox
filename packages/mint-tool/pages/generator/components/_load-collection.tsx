import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import useEffectAsync from '@tiexohq/marketplace-common/ui/hooks/use-effect-async'
import {
    getAttributesData,
    IAttributesData,
} from 'packages/mint-tool/components/mint-tool-page/data'
import { useState } from 'react'

import useDrivePicker from 'react-google-drive-picker/dist'

const worker = new Worker('/worker.js')
worker.onmessage = e => console.log('worker message', e.data)

enum ScreenState {
    DEFAULT,
    LOADING,
}

const LoadCollection = ({ onCollectionLoaded }) => {
    const [openPicker, drivePickerData] = useDrivePicker()
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.DEFAULT)

    useEffectAsync(async () => {
        // do anything with the selected/uploaded files
        if (drivePickerData && drivePickerData.action === 'picked') {
            //  console.log(drivePickerData);
            // load data and put it in state
            setScreenState(ScreenState.LOADING)
            // get attributes data
            const data = await getAttributesData(drivePickerData.docs[0].id)
            console.log(data)
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
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        onClick={() => {
                            worker.postMessage({ action: 'dummy', n: 10000000000 })

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
                )}
            </Grid>
        </Grid>
    )
}

export default LoadCollection
