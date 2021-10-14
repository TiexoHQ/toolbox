import { INftGeneratorAttributesCompatibility } from 'packages/mint-tool/utils/nft-generator/types'
import React from 'react'
import { IAttributesData } from '../../mint-tool-page/data'
import AttributeCompatibility from './components/attribute-compatibility'
import AddIcon from '@mui/icons-material/Add'
import { IconButton } from '@mui/material'

interface IEditCapabilitiesProps {
    attrCompatibility: INftGeneratorAttributesCompatibility[]
    onChange: (attrCompatibility: INftGeneratorAttributesCompatibility[]) => void
    attributesData: IAttributesData
}

const EditCapabilities: React.FC<IEditCapabilitiesProps> = (props: IEditCapabilitiesProps) => {
    const onChange = (value: INftGeneratorAttributesCompatibility, index) => {
        const copy = [...props.attrCompatibility]
        copy[index] = value
        props.onChange(copy)
    }

    const onAddNewCapability = () => {
        props.onChange([
            ...props.attrCompatibility,
            {
                type: 'allow',
                condition: {},
            },
        ])
    }

    const onDeleteCapability = (index: number) => {
        const copy = [...props.attrCompatibility]
        copy.splice(index, 1)
        props.onChange(copy)
    }

    return (
        <div>
            {props.attrCompatibility.map((it, index) => (
                <div key={it.name || '' + index}>
                    <p style={{ margin: 0 }}>#{index + 1}</p>
                    <AttributeCompatibility
                        key={it.name}
                        compatibility={it}
                        onChange={value => onChange(value, index)}
                        onDelete={() => onDeleteCapability(index)}
                        attributesData={props.attributesData}
                    />
                </div>
            ))}
            <IconButton onClick={onAddNewCapability}>
                <AddIcon />
            </IconButton>
        </div>
    )
}

export default EditCapabilities
