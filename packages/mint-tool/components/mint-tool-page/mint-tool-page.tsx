import useStyles from './style'
import { useState } from 'react'
import useEffectAsync from '@tiexohq/marketplace-common/ui/hooks/use-effect-async'

import useDrivePicker from 'react-google-drive-picker/dist'
import { Button, Drawer, CircularProgress, Box, Typography } from '@mui/material'

import { getAttributesData, IAttributesData } from './data'
import AttributesSelectors from '../attributes-selectors/attributes-selectors'

const preloadImage = (url: string): Promise<void> =>
    new Promise(resolve => {
        // console.log('preload', url);
        const img = new Image()
        img.onload = () => resolve()
        img.src = url
    })

function CircularProgressWithLabel(props: { value: number }) {
    return (
        <Box sx={{ position: 'fixed', right: '16px', top: '8px', left: 'auto' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    )
}

export const MintToolPage = () => {
    const styles = useStyles()
    const [openPicker, drivePickerData] = useDrivePicker()
    const [attributesData, setAttributesData] = useState<IAttributesData>()
    const [isLoading, toggleLoading] = useState<boolean>(false)
    const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0)

    const loadFilesFromDrive = async () => {
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
    }

    useEffectAsync(async () => {
        // do anything with the selected/uploaded files
        if (drivePickerData && drivePickerData.action === 'picked') {
            //  console.log(drivePickerData);
            // load data and put it in state
            setLoadedImagesCount(0)
            toggleLoading(true)
            // get attributes data
            const data = await getAttributesData(drivePickerData.docs[0].id)
            setAttributesData(data)
            console.log(JSON.stringify(data))

            // preload images
            let loadedImages = 0
            await Promise.all(
                data?.images.map(image => {
                    //  console.log('trigger');
                    return preloadImage(image.imageUrl).then(d => {
                        loadedImages += 1
                        setLoadedImagesCount(loadedImages)
                        return d
                    })
                }) || []
            )

            toggleLoading(false)
        }
    }, [drivePickerData])

    return (
        <div className={styles.root}>
            {isLoading && (
                <CircularProgressWithLabel
                    value={Math.floor(
                        (loadedImagesCount / (attributesData?.images.length || 1)) * 100
                    )}
                />
            )}
            <div className={styles.imageContainer}>
                {attributesData?.layers.map(layer => {
                    const attribute = attributesData.attributes.find(
                        a => a.name === layer.attributeName
                    )
                    if (attribute) {
                        const image = attributesData.images.find(
                            i =>
                                i.layerName === layer.name && i.name === attribute.selectedValueName
                        )

                        if (image) {
                            return <img src={image.imageUrl} key={layer.name} />
                        }
                    }
                    return null
                })}
            </div>
            <Drawer className={styles.layersController} variant="permanent" anchor="right">
                {(attributesData && (
                    <AttributesSelectors
                        attributesData={attributesData}
                        onAttributesChange={data => setAttributesData(data)}
                    />
                )) || (
                    <div className={styles.loadFiles}>
                        <h1>Load your files</h1>
                        <p>
                            Click on “Load files” button and select your NFT Folder from Google
                            Drive.
                        </p>
                    </div>
                )}
                <div className={styles.drawerFooter}>
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        className={styles.loadButton}
                        onClick={loadFilesFromDrive}
                    >
                        {'Load Files'}
                    </Button>
                </div>
            </Drawer>
        </div>
    )
}

export default MintToolPage
