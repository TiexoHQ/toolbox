import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'
import NftPreview from 'packages/mint-tool/components/nft-preview/nft-preview'
import { INft } from 'packages/mint-tool/utils/nft-generator/types'

interface IProps {
    nftList: INft[]
    attributesData: IAttributesData
}

const PreviewTab: React.FC<IProps> = ({ nftList, attributesData }: IProps) => {
    const imagesMap = {}
    for (const image of attributesData.images) {
        if (!imagesMap[image.layerName]) imagesMap[image.layerName] = {}

        imagesMap[image.layerName][image.name] = image.imageUrl
    }

    console.log({ imagesMap })

    return (
        <>
            {Array.isArray(nftList) && nftList?.length === 0 && (
                <Typography>No NFTs generated. Use Generate button.</Typography>
            )}
            {Array.isArray(nftList) && nftList?.length > 0 && (
                <>
                    <Grid container spacing={2}>
                        {nftList.map((nft, index) => (
                            <Grid item xs={4} key={`nft-${index}`}>
                                <NftPreview
                                    images={attributesData.layers
                                        .map(
                                            layer =>
                                                imagesMap[layer.name][
                                                    nft?.attributes[layer.attributeName]
                                                ]
                                        )
                                        .filter(Boolean)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </>
    )
}

export default PreviewTab
