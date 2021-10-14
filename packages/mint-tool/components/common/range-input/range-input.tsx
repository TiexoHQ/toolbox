import { TextField } from '@mui/material'
import { isNumber } from 'packages/mint-tool/utils/nft-generator/helpers/other'
import { INumberRange } from 'packages/mint-tool/utils/nft-generator/types'
import React, { useState } from 'react'

interface IRangeInputProps {
    range?: INumberRange
    label: string
    onChange: (value?: INumberRange) => void
}

const RangeInput: React.FC<IRangeInputProps> = (props: IRangeInputProps) => {
    const [localRange, setLocalRange] = useState(
        props.range
            ? props.range
            : {
                  min: undefined,
                  max: undefined,
              }
    )
    return (
        <div style={{ display: 'flex' }}>
            <p style={{ marginRight: 10, alignSelf: 'center' }}>{props.label}: </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Min"
                    variant="outlined"
                    type="number"
                    defaultValue={localRange?.min}
                    onChange={e =>
                        setLocalRange({
                            ...localRange,
                            min: isNumber(e.target.value) ? Number(e.target.value) : undefined,
                        })
                    }
                    onBlur={() => props.onChange(localRange)}
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    label="Max"
                    variant="outlined"
                    type="number"
                    defaultValue={localRange?.max}
                    onChange={e =>
                        setLocalRange({
                            ...localRange,
                            max: isNumber(e.target.value) ? Number(e.target.value) : undefined,
                        })
                    }
                    onBlur={() => props.onChange(localRange)}
                />
            </div>
        </div>
    )
}

export default RangeInput
