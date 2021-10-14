import RangeInput from 'packages/mint-tool/components/common/range-input/range-input'
import CustomSelect from 'packages/mint-tool/components/common/select/custom-select'
import {
    IAttributeDto,
    INumberRange,
    SelectOptions,
} from 'packages/mint-tool/utils/nft-generator/types'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import React, { useMemo } from 'react'
import { IconButton } from '@mui/material'
import { replaceFieldAtIndex } from 'packages/mint-tool/utils/nft-generator/helpers/other'
import useCustomStyles from 'packages/mint-tool/styles/common'

interface IAttributeOccuranceProps {
    attr: string
    values?: {
        [attributeValue: string]: INumberRange
    }
    attributes: Array<IAttributeDto>
    onChange: (
        attr: string,
        values?: {
            [attributeValue: string]: INumberRange
        }
    ) => void
    onDeleteEntry: () => void
}

const AttributeOccurance: React.FC<IAttributeOccuranceProps> = (
    props: IAttributeOccuranceProps
) => {
    const commonStyle = useCustomStyles()
    const attributeOptions: SelectOptions[] = useMemo(() => {
        const options: SelectOptions[] = []
        options.push({
            label: '--any attribute--',
            value: '*',
        })
        props.attributes.map(item => {
            options.push({
                label: item.displayName,
                value: item.name,
            })
        })
        return options
    }, [props.attributes])

    const attributeValuesOptions: SelectOptions[] = useMemo(() => {
        const options: SelectOptions[] = []
        options.push({
            label: '--any value--',
            value: '*',
        })

        const attribute = props.attributes.find(a => a.name === props.attr)
        if (attribute) {
            attribute.values.map(value =>
                options.push({
                    label: value.displayName,
                    value: value.name,
                })
            )
        }
        return options
    }, [props.attr, props.attributes])

    const onChangeRange = (range: INumberRange | undefined, attrLocal: string) => {
        const copy = props.values ? { ...props.values } : {}
        copy[attrLocal] = range || { min: undefined, max: undefined }
        props.onChange(props.attr, copy)
    }

    const onAddNewRange = () => {
        const copy = props.values ? { ...props.values } : {}
        let unusedAttribute = ''
        attributeValuesOptions.forEach(attr => {
            if (!copy[attr.value]) {
                unusedAttribute = attr.value.toString()
            }
        })
        if (unusedAttribute) {
            copy[unusedAttribute] = { min: undefined, max: undefined }
            props.onChange(props.attr, copy)
        }
    }

    const onDeleteDependent = (attr: string) => {
        const copy = props.values ? { ...props.values } : {}
        delete copy[attr]
        props.onChange(props.attr, copy)
    }

    const onChangeDependentName = (attr: string, index: number) => {
        const copy = { ...props.values }
        let oldValue
        if (copy) {
            Object.keys(copy).forEach((el, localIndex) => {
                if (localIndex === index) {
                    oldValue = copy[el]
                }
            })
        }
        const newValues = replaceFieldAtIndex(props.values, index, attr, oldValue)
        props.onChange(props.attr, newValues)
    }
    // borderRadius: 10, padding: 5, marginBottom: 10
    return (
        <div className={commonStyle.shadowItem}>
            <div>
                <CustomSelect
                    value={props.attr}
                    onChangeValue={val => props.onChange(val, props.values)}
                    options={attributeOptions}
                    style={{ minWidth: 200 }}
                />
                <IconButton onClick={props.onDeleteEntry}>
                    <DeleteIcon color={'error'} />
                </IconButton>
            </div>
            <div>
                <p style={{ margin: 0 }}>Values</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {props.values &&
                        Object.keys(props.values).map((attrLocal, index) => (
                            <div key={props.attr + attrLocal + index} style={{ marginRight: 30 }}>
                                <div>
                                    <CustomSelect
                                        value={attrLocal}
                                        onChangeValue={val => onChangeDependentName(val, index)}
                                        options={attributeValuesOptions}
                                        style={{ minWidth: 200 }}
                                    />
                                    <IconButton onClick={() => onDeleteDependent(attrLocal)}>
                                        <DeleteIcon color={'error'} />
                                    </IconButton>
                                </div>

                                <RangeInput
                                    range={props.values?.[attrLocal]}
                                    label={'values'}
                                    onChange={val => onChangeRange(val, attrLocal)}
                                />
                            </div>
                        ))}
                    <IconButton onClick={onAddNewRange}>
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default AttributeOccurance
