import { Grid, TextField } from '@mui/material'
import { INftGeneratorOptions } from 'packages/mint-tool/utils/nft-generator/types'
import React from 'react'

interface IEditSettingsProps {
    options: INftGeneratorOptions
    onChange: (value: number, fild: keyof INftGeneratorOptions) => void
}

const EditSettings: React.FC<IEditSettingsProps> = (props: IEditSettingsProps) => {
    return (
        <Grid
            container
            direction={'column'}
            spacing={4}
            alignContent={'start'}
            justifyContent={'start'}
            style={{}}
        >
            <Grid item>
                <TextField
                    label="Nft count"
                    variant="outlined"
                    type="number"
                    value={props.options?.nftCount}
                    onChange={e => props.onChange(Number(e.target.value), 'nftCount')}
                />
            </Grid>

            <Grid item>
                <TextField
                    label="Random seed"
                    variant="outlined"
                    type="number"
                    value={props.options?.randomSeed}
                    onChange={e => props.onChange(Number(e.target.value), 'randomSeed')}
                />
            </Grid>

            <Grid item>
                <TextField
                    label="Max tries"
                    variant="outlined"
                    type="number"
                    value={props.options?.maxTries}
                    onChange={e => props.onChange(Number(e.target.value), 'maxTries')}
                />
            </Grid>
        </Grid>
    )
}

export default EditSettings
