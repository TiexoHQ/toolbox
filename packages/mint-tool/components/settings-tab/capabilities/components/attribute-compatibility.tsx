import DeleteIcon from '@mui/icons-material/Delete'
import { Grid, IconButton, TextField } from '@mui/material'
import CustomSelect from 'packages/mint-tool/components/common/select/custom-select'
import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'
import useCommonStyles from 'packages/mint-tool/styles/common'
import {
    AttrType,
    INftGeneratorAttributesCompatibility,
    INftGeneratorAttributesCompatibilityCondition,
    SelectOptions,
} from 'packages/mint-tool/utils/nft-generator/types'
import React, { useState } from 'react'
import Conditions from './conditions'

interface IAttributeCompatibilityProps {
    compatibility: INftGeneratorAttributesCompatibility
    onChange: (value: INftGeneratorAttributesCompatibility) => void
    onDelete: () => void

    attributesData: IAttributesData
}

const AttributeCompatibility: React.FC<IAttributeCompatibilityProps> = (
    props: IAttributeCompatibilityProps
) => {
    const commonStyle = useCommonStyles()
    const [localCompatibility, setLocalCompatibility] = useState(props.compatibility)

    const onChange = (value: INftGeneratorAttributesCompatibilityCondition) => {
        props.onChange({
            ...props.compatibility,
            condition: value,
        })
    }

    const onDelete = (type: AttrType) => {
        const copy = { ...props.compatibility.condition }
        delete copy[type.toLocaleLowerCase()]
        props.onChange({
            ...props.compatibility,
            condition: copy,
        })
    }

    return (
        <div className={commonStyle.borderWrapper}>
            <Grid container direction="row" alignItems="center" spacing={5}>
                <Grid item>
                    <TextField
                        label="Name"
                        variant="outlined"
                        defaultValue={props.compatibility.name}
                        onChange={e =>
                            setLocalCompatibility({ ...props.compatibility, name: e.target.value })
                        }
                        onBlur={() => props.onChange(localCompatibility)}
                    />
                </Grid>

                <Grid item>
                    <CustomSelect
                        label="Random seed"
                        value={props.compatibility.type}
                        onChangeValue={val => props.onChange({ ...props.compatibility, type: val })}
                        options={typeOptions}
                    />
                </Grid>

                <Grid item>
                    <IconButton onClick={props.onDelete}>
                        <DeleteIcon color={'error'} />
                    </IconButton>
                </Grid>
            </Grid>
            <p>condition: </p>

            <Conditions
                condition={props.compatibility.condition}
                level={0}
                onChange={onChange}
                onDelete={onDelete}
                attributes={props.attributesData.attributes}
            />
        </div>
    )
}

const typeOptions: SelectOptions[] = [
    {
        label: 'allow',
        value: 'allow',
    },
    {
        label: 'deny',
        value: 'deny',
    },
]

export default AttributeCompatibility
