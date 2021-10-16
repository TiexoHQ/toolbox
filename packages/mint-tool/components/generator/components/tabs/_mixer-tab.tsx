import Grid from '@mui/material/Grid'
import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'
import { useEffect, useState } from 'react'
import AttributesSelector from '../../../attributes-selectors/attributes-selectors'
import NftPreview from '../../../nft-preview/nft-preview'

interface IProps {
    attributesData: IAttributesData
}
const MixerTab: React.FC<IProps> = (props: IProps) => {
    const [attributesData, setAttributesData] = useState<IAttributesData>(props.attributesData)

    useEffect(() => {
        setAttributesData(props.attributesData)
    }, [props.attributesData])

    return (
        <>
            <Grid container sx={{ flex: 1 }}>
                <Grid item xs={true} sx={{ textAlign: 'center' }}>
                    <NftPreview
                        images={
                            attributesData.layers
                                .map(layer => {
                                    const attribute = attributesData.attributes.find(
                                        a => a.name === layer.attributeName
                                    )

                                    if (attribute) {
                                        const image = attributesData.images.find(
                                            i =>
                                                i.name === attribute.selectedValueName &&
                                                i.layerName === layer.name
                                        )
                                        if (image) {
                                            return image.imageUrl
                                        }
                                    }
                                    return undefined
                                })
                                .filter(Boolean) as any
                        }
                    />
                </Grid>
                <Grid item style={{ width: 360 }}>
                    <AttributesSelector
                        attributesData={attributesData}
                        onAttributesChange={data => setAttributesData(data)}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default MixerTab
