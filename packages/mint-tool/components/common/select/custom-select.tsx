// import { MenuItem, Select, SelectProps } from '@material-ui/core'
import { SelectOptions } from 'packages/mint-tool/utils/nft-generator/types'

import { OutlinedInput, MenuItem, Select, SelectProps } from '@mui/material'
import React from 'react'
import styles from './custom-select.style'

interface ICustomSelectProps<T> extends SelectProps {
    options: SelectOptions[]
    value: T
    onChangeValue: (value: T) => void
}

function CustomSelect<T>(props: ICustomSelectProps<T>) {
    const style = styles()
    const { options, value, onChangeValue, ...selectProps } = props
    return (
        <Select
            value={value}
            displayEmpty={false}
            onChange={e => onChangeValue(e.target.value as T)}
            input={<OutlinedInput color={'primary'} />}
            {...selectProps}
            className={style.customSelect}
        >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    )
}

export default CustomSelect
