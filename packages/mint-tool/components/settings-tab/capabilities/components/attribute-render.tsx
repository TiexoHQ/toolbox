import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { SelectOptions } from 'packages/mint-tool/utils/nft-generator/types'
import React, { useEffect, useMemo, useState } from 'react'

interface IAttributeRenderProps {
    attr: string
    value: string[] | '*' | 'undefined'
    onChangeAttribute: (val: any, attr: string) => void
    options: Array<{
        name: string
        displayName: string
    }>
}

const convertProps = (value: string[] | '*' | 'undefined'): string[] => {
    if (Array.isArray(value)) {
        return value
    }
    return [value]
}

const AttributeRender: React.FC<IAttributeRenderProps> = (props: IAttributeRenderProps) => {
    const [localValue, setLocalValue] = useState<string[]>(convertProps(props.value))

    const handleChange = (event: SelectChangeEvent<typeof localValue>) => {
        const {
            target: { value },
        } = event
        const withoutValues = Array.isArray(value)
            ? value.filter(it => !(it === '*' || it === 'undefined'))
            : [value]
        if (withoutValues.length < value.length) {
            if (value[value.length - 1] === '*' || value[value.length - 1] === 'undefined') {
                setLocalValue([value[value.length - 1]])
                return
            }
            setLocalValue(withoutValues)
            return
        }
        setLocalValue(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value
        )
    }
    const attributesOptions: SelectOptions[] = useMemo(() => {
        const opts: SelectOptions[] = [
            {
                label: '--NONE--',
                value: 'undefined',
            },

            {
                label: '--ALL--',
                value: '*',
            },
        ]
        props.options.forEach(it => {
            opts.push({
                label: it.displayName,
                value: it.name,
            })
        })
        return opts
    }, [props.options])

    useEffect(() => {
        props.onChangeAttribute(localValue, props.attr)
    }, [localValue])

    return (
        <div
            style={{
                display: 'flex',
                marginRight: 15,
            }}
        >
            <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel id="demo-multiple-checkbox-label">{props.attr}</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={localValue}
                    onChange={handleChange}
                    input={<OutlinedInput label={props.attr} />}
                    renderValue={selected =>
                        selected
                            .map(it => attributesOptions.find(el => el.value === it)?.label)
                            .join(', ')
                    }
                >
                    {attributesOptions.map(it => (
                        <MenuItem key={it.value} value={it.value}>
                            <Checkbox checked={localValue.indexOf(it.value.toString()) > -1} />
                            <ListItemText primary={it.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default AttributeRender
