import { Grid, IconButton, TextField } from '@mui/material'
import RangeInput from 'packages/mint-tool/components/common/range-input/range-input'
import { INftGeneratorRarityTarget } from 'packages/mint-tool/utils/nft-generator/types'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useEffect, useState } from 'react'

interface IRarityDisplayProps {
    data: INftGeneratorRarityTarget
    onChange: (data: INftGeneratorRarityTarget) => void
    onDelete: () => void
}

const RarityDisplay: React.FC<IRarityDisplayProps> = (props: IRarityDisplayProps) => {
    const [localData, setLocalData] = useState(props.data)

    // console.log('local: ', localData)
    useEffect(() => {
        props.onChange(localData)
    }, [localData])

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            spacing={5}
            style={{ marginBottom: 20 }}
        >
            <Grid item>
                <TextField
                    label="Nft count"
                    variant="outlined"
                    type="number"
                    defaultValue={localData.nftCount}
                    onChange={e =>
                        setLocalData({
                            ...localData,
                            nftCount: Number(e.target.value),
                        })
                    }
                />
            </Grid>
            <Grid item>
                <RangeInput
                    label="Rarity score"
                    range={localData.rarityScore}
                    onChange={val =>
                        setLocalData({
                            ...localData,
                            rarityScore: val,
                        })
                    }
                />
            </Grid>
            <Grid item>
                <RangeInput
                    label="Attributes count"
                    range={localData.attributesCount}
                    onChange={val =>
                        setLocalData({
                            ...localData,
                            attributesCount: val,
                        })
                    }
                />
            </Grid>
            <Grid item>
                <IconButton onClick={props.onDelete}>
                    <DeleteIcon color={'error'} />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default RarityDisplay
