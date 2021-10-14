import { IconButton, Typography } from '@mui/material'
import {
    IAttributeDto,
    INftGeneratorRarityTarget,
    INumberRange,
    ITargetType,
} from 'packages/mint-tool/utils/nft-generator/types'
import React from 'react'
import RarityDisplay from './components/rarity-display'
import AddIcon from '@mui/icons-material/Add'
import AttributeOccurance from './components/attribute-occurence'
import { replaceFieldAtIndex } from 'packages/mint-tool/utils/nft-generator/helpers/other'
import useCommonStyles from 'packages/mint-tool/styles/common'

interface IEditTargetsProps {
    targets: ITargetType
    onChange: (data: ITargetType) => void
    attributes: Array<IAttributeDto>
}

const EditTargets: React.FC<IEditTargetsProps> = (props: IEditTargetsProps) => {
    const commonStyles = useCommonStyles()
    const onAddRarityEntry = () => {
        props.onChange({
            ...props.targets,
            rarity: [
                ...props.targets.rarity,
                {
                    nftCount: 0,
                },
            ],
        })
    }

    const onDelete = (index: number) => {
        const copy = [...props.targets.rarity]
        copy.splice(index, 1)
        props.onChange({
            ...props.targets,
            rarity: copy,
        })
    }

    const onChange = (data: INftGeneratorRarityTarget, index: number) => {
        const copy = [...props.targets.rarity]
        copy[index] = data
        props.onChange({
            ...props.targets,
            rarity: copy,
        })
    }

    const onChangeAttribute = (
        attr: string,
        values: {
            [attributeValue: string]: INumberRange
        },
        index: number
    ) => {
        props.onChange({
            ...props.targets,
            attributesValuesOccurences: replaceFieldAtIndex(
                props.targets.attributesValuesOccurences,
                index,
                attr,
                values
            ),
        })
    }

    const onAddNewEntry = () => {
        props.onChange({
            ...props.targets,
            attributesValuesOccurences: {
                ...props.targets.attributesValuesOccurences,
                '*': { '*': { min: undefined, max: undefined } },
            },
        })
    }

    const onDeleteEntry = (index: number) => {
        const copy = { ...(props.targets.attributesValuesOccurences || {}) }
        Object.keys(copy).forEach((el, localIndex) => {
            if (localIndex === index) {
                delete copy[el]
            }
        })
        props.onChange({
            ...props.targets,
            attributesValuesOccurences: copy,
        })
    }

    return (
        <div>
            <div>
                <Typography variant="h5" color={'white'}>
                    Rarity:
                </Typography>
                <div className={commonStyles.borderWrapper}>
                    {props.targets?.rarity.map((rarity, index) => (
                        <RarityDisplay
                            key={'rarity_' + index}
                            data={rarity}
                            onChange={data => onChange(data, index)}
                            onDelete={() => onDelete(index)}
                        />
                    ))}
                    <IconButton onClick={onAddRarityEntry}>
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <Typography variant="h5" color={'white'}>
                    Attributes occurence:
                </Typography>
                <div className={commonStyles.borderWrapper}>
                    {props.targets?.attributesValuesOccurences &&
                        Object.keys(props.targets.attributesValuesOccurences).map((attr, index) => (
                            <div key={'occ_' + index}>
                                <p style={{ margin: 0 }}>#{index + 1}</p>
                                <AttributeOccurance
                                    attr={attr}
                                    values={props.targets?.attributesValuesOccurences?.[attr]}
                                    attributes={props.attributes}
                                    onChange={(attr, values) =>
                                        onChangeAttribute(attr, values || {}, index)
                                    }
                                    onDeleteEntry={() => onDeleteEntry(index)}
                                />
                            </div>
                        ))}

                    <IconButton onClick={onAddNewEntry}>
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default EditTargets
