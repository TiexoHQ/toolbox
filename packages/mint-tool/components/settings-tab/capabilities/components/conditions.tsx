import AddIcon from '@mui/icons-material/Add'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import CustomSelect from 'packages/mint-tool/components/common/select/custom-select'
import {
    AttrType,
    IAttributeDto,
    INftGeneratorAttributesCompatibilityCondition,
    SelectOptions,
} from 'packages/mint-tool/utils/nft-generator/types'
import React, { useEffect, useMemo, useState } from 'react'
import AttributeRender from './attribute-render'
import useCommonStyle from 'packages/mint-tool/styles/common'

interface IConditionsProps {
    condition: INftGeneratorAttributesCompatibilityCondition
    level: number
    onChange: (
        value: INftGeneratorAttributesCompatibilityCondition,
        type?: AttrType,
        index?: number
    ) => void
    onDelete: (type: AttrType, index: number) => void
    index?: number

    attributes: Array<IAttributeDto>
}

const Conditions: React.FC<IConditionsProps> = (props: IConditionsProps) => {
    const commonStyles = useCommonStyle()
    const [newAttribute, setNewAttribute] = useState('-')
    const [type, setType] = useState<AttrType>(getType(props.condition))

    useEffect(() => {
        setType(getType(props.condition))
    }, [props.condition])

    const attributeOptions: SelectOptions[] = useMemo(() => {
        const options: SelectOptions[] = []
        options.push({
            label: '--new attribute--',
            value: '-',
        })
        props.attributes.map(item => {
            options.push({
                label: item.displayName,
                value: item.name,
            })
        })
        return options
    }, [props.attributes])

    const onChangeAttribute = (val: string, attr: string) => {
        const copy = { ...props.condition }
        copy[type.toLocaleLowerCase()][attr] = val
        props.onChange(copy, AttrType.ATTRIBUTES, props.index)
    }

    const onAddAttribute = () => {
        if (!newAttribute || newAttribute === '-') {
            return
        }
        let newCondition: INftGeneratorAttributesCompatibilityCondition
        if (props.condition) {
            newCondition = {
                ...props.condition,
                attributes: {
                    ...props.condition.attributes,
                    [newAttribute]: '*',
                },
            }
        } else {
            newCondition = {
                attributes: {
                    [newAttribute]: '*',
                },
            }
        }

        props.onChange(newCondition, AttrType.ATTRIBUTES, props.index)
        setNewAttribute('-')
    }

    const setCustomType = (type: AttrType) => {
        setType(type)

        if (type === AttrType.AND || type === AttrType.OR) {
            props.onChange(
                {
                    [type.toLocaleLowerCase()]: [],
                },
                type,
                props.index
            )
        }
    }

    const addNewCondition = (type: 'and' | 'or') => {
        props.onChange(
            {
                ...props.condition,
                [type]: [...(props.condition[type] || []), {}],
            },
            type === 'and' ? AttrType.AND : AttrType.OR
        )
    }

    const localChange = (
        value: INftGeneratorAttributesCompatibilityCondition,
        typeParam?: AttrType,
        index?: number
    ) => {
        const copy: INftGeneratorAttributesCompatibilityCondition = { ...props.condition }
        const andOr = type.toLocaleLowerCase()
        if (index !== undefined) {
            copy[andOr][index] = value
            props.onChange(copy)
        } else {
            const andOrParam = typeParam?.toLocaleLowerCase() || ''
            const foundIndex = copy[andOr]?.findIndex(item => !!item?.[andOrParam])
            if (foundIndex !== -1) {
                copy[andOr][foundIndex] = value
            }
            props.onChange(copy, typeParam, index)
        }
    }

    const localDelete = (typeParam: AttrType, index?: number) => {
        const copy: INftGeneratorAttributesCompatibilityCondition = { ...props.condition }
        const andOr = type.toLocaleLowerCase()
        if (index !== undefined) {
            delete copy[andOr][index]
            props.onChange(copy)
        } else {
            const andOrParam = typeParam?.toLocaleLowerCase() || ''
            const foundIndex = copy[andOr]?.findIndex(item => !!item[andOrParam])
            if (foundIndex !== -1) {
                delete copy[andOr][foundIndex]
            }
            props.onChange(copy)
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    // border: '2px solid grey',
                    borderRadius: 10,
                    marginLeft: props.level * 20,
                    minWidth: 500,
                    padding: 5,
                    marginBottom: 10,
                }}
                className={commonStyles.shadowItem}
            >
                <CustomSelect
                    value={type}
                    onChangeValue={setCustomType}
                    placeholder={'Select type'}
                    options={typeOptions}
                />

                {type === AttrType.AND && (
                    <div>
                        And:
                        {props.condition.and?.map((it, index) => (
                            <div
                                key={'and_' + props.level + index}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <ArrowRightAlt />
                                <Conditions
                                    condition={it}
                                    level={props.level + 1}
                                    onChange={localChange}
                                    onDelete={localDelete}
                                    index={index}
                                    attributes={props.attributes}
                                />
                            </div>
                        ))}
                        <IconButton onClick={() => addNewCondition('and')}>
                            <AddIcon />
                        </IconButton>
                    </div>
                )}

                {type === AttrType.OR && (
                    <div>
                        Or:
                        {props.condition.or?.map((it, index) => (
                            <div
                                key={'or_' + props.level + index}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <ArrowRightAlt />
                                <Conditions
                                    condition={it}
                                    level={props.level + 1}
                                    onChange={localChange}
                                    onDelete={localDelete}
                                    index={index}
                                    attributes={props.attributes}
                                />
                            </div>
                        ))}
                        <IconButton onClick={() => addNewCondition('or')}>
                            <AddIcon />
                        </IconButton>
                    </div>
                )}
                {type === AttrType.ATTRIBUTES && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ marginRight: 10 }}>Attributes: </p>
                            {props.condition?.attributes &&
                                Object.keys(props.condition.attributes).map(attr => (
                                    <AttributeRender
                                        key={attr}
                                        attr={attr}
                                        options={
                                            props.attributes?.find(it => it.name === attr)
                                                ?.values || []
                                        }
                                        value={props.condition.attributes?.[attr] || 'undefined'}
                                        onChangeAttribute={onChangeAttribute}
                                    />
                                ))}
                            <div>
                                <CustomSelect
                                    value={newAttribute}
                                    onChangeValue={setNewAttribute}
                                    options={attributeOptions}
                                    style={{ minWidth: 200 }}
                                />
                                <IconButton onClick={onAddAttribute}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {!(props.level === 0 && type === AttrType.NOT_SELECTED) && (
                <IconButton onClick={() => props.onDelete(type, props.index || 0)}>
                    <DeleteIcon color={'error'} />
                </IconButton>
            )}
        </div>
    )
}

const typeOptions: SelectOptions[] = [
    {
        label: '--no value--',
        value: 'NOT_SELECTED',
    },
    {
        label: 'AND condition',
        value: 'AND',
    },

    {
        label: 'OR condition',
        value: 'OR',
    },
    {
        label: 'Attributes',
        value: 'ATTRIBUTES',
    },
]

const getType = (condition: INftGeneratorAttributesCompatibilityCondition): AttrType => {
    if (!condition) {
        return AttrType.NOT_SELECTED
    }
    if (condition.and) {
        return AttrType.AND
    }

    if (condition.or) {
        return AttrType.OR
    }

    if (condition.attributes) {
        return AttrType.ATTRIBUTES
    }
    return AttrType.NOT_SELECTED
}

export default Conditions
