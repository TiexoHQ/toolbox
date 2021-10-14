import { useState } from 'react'
import { IAttributesData } from '../mint-tool-page/data'

import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Stop from '@mui/icons-material/Stop'
import FastForward from '@mui/icons-material/FastForward'

import useStyle from './style'
import { useEffect } from 'react'

interface IProps {
    attributesData: IAttributesData
    onAttributesChange: (attributesData: IAttributesData) => void
}

interface IPlayOptions {
    speed: number
    isPlaying: boolean
}

let interval: any = undefined
const SPEED_INTERVAL_MS = [1500, 1000, 500, 300, 100]

function getRandomName(names: any[]) {
    return names[Math.floor(Math.random() * (names.length - 1))]
}

function getNextSpeed(currentSpeed: number): number {
    return (currentSpeed + 1) % 5
}

const AttributesSelectors = (props: IProps) => {
    const styles = useStyle()
    const [checks, setChecks] = useState<{ [key: string]: boolean }>({})
    const [playOptions, setPlayOptions] = useState<IPlayOptions>({
        speed: 0,
        isPlaying: false,
    })

    const checkAll = (value: boolean) => {
        const chs: any = {}
        for (const attribute of props.attributesData.attributes) {
            chs[attribute.name] = value
        }
        setChecks(chs)
    }

    const randomize = () => {
        const data = { ...props.attributesData }

        for (const attribute of data.attributes) {
            if (checks[attribute.name]) {
                const list = attribute.values.map(v => v.name)
                if (attribute.canMiss) {
                    list.unshift('[NONE]')
                }
                attribute.selectedValueName = getRandomName(list)
            }
        }

        props.onAttributesChange(data)
    }

    useEffect(() => {
        if (playOptions.isPlaying) {
            clearInterval(interval)
            interval = setInterval(() => {
                randomize()
            }, SPEED_INTERVAL_MS[playOptions.speed])
        } else {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }
    }, [playOptions, checks])

    useEffect(() => {
        if (props.attributesData.attributes.length > 0) {
            checkAll(true)
        }
    }, [props.attributesData?.attributes])

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Checkbox
                    defaultChecked
                    size="small"
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={event => checkAll(event.target.checked)}
                />
            </Grid>
            <Grid item xs={10}>
                <ButtonGroup disableElevation variant="contained">
                    <Button onClick={randomize}>
                        <AutoFixHighIcon />
                    </Button>
                    <Button
                        onClick={() =>
                            setPlayOptions({
                                isPlaying: !playOptions.isPlaying,
                                speed: 0,
                            })
                        }
                    >
                        {playOptions.isPlaying ? <Stop /> : <PlayArrow />}
                    </Button>
                    <Button
                        onClick={() =>
                            setPlayOptions({
                                isPlaying: true,
                                speed: getNextSpeed(playOptions.speed),
                            })
                        }
                        disabled={!playOptions.isPlaying}
                    >
                        <FastForward /> {getNextSpeed(playOptions.speed) + 1}x
                    </Button>
                </ButtonGroup>
            </Grid>

            {props.attributesData.attributes.map(attribute => [
                <Grid item xs={1} key={`attr-checkbox-container-${attribute.name}`}>
                    <Checkbox
                        className={styles.checkbox}
                        size="small"
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={checks[attribute.name] || false}
                        onChange={event => {
                            const chs: any = { ...checks }
                            chs[attribute.name] = event.target.checked
                            setChecks(chs)
                        }}
                    />
                </Grid>,
                <Grid item xs={8} key={`attr-select-container-${attribute.name}`}>
                    <FormControl fullWidth>
                        <InputLabel id={`attribute-select-${attribute.name.replace(/ /gi, '')}`}>
                            {attribute.displayName}
                        </InputLabel>
                        <Select
                            labelId={`attribute-select-${attribute.name.replace(/ /gi, '')}`}
                            id="attribute-select"
                            value={attribute.selectedValueName || '[NONE]'}
                            label={attribute.displayName}
                            onChange={event => {
                                const data = { ...props.attributesData }
                                const attr = data.attributes.find(a => a.name === attribute.name)
                                if (attr) {
                                    attr.selectedValueName = event.target.value
                                    props.onAttributesChange(data)
                                }
                            }}
                        >
                            {attribute.canMiss && (
                                <MenuItem value={'[NONE]'} key="[NONE]">
                                    None
                                </MenuItem>
                            )}
                            {attribute.values.map(value => (
                                <MenuItem value={value.name} key={value.name}>
                                    {value.displayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>,
                <Grid item xs={3} key={`attr-button-left-container-${attribute.name}`}>
                    <ButtonGroup disableElevation variant="contained">
                        <Button
                            className={styles.button}
                            disabled={attribute.values.length < 1}
                            onClick={() => {
                                const data = { ...props.attributesData }
                                const attr = data.attributes.find(a => a.name === attribute.name)
                                if (attr) {
                                    const nextIndex =
                                        attr.values
                                            .map(v => v.name)
                                            .indexOf(attr.selectedValueName) - 1
                                    attr.selectedValueName =
                                        attr.values[nextIndex]?.name ||
                                        attr.values[attr.values.length - 1].name
                                    props.onAttributesChange(data)
                                }
                            }}
                        >
                            <KeyboardArrowLeft />
                        </Button>
                        <Button
                            className={styles.button}
                            disabled={attribute.values.length < 1}
                            onClick={() => {
                                const data = { ...props.attributesData }
                                const attr = data.attributes.find(a => a.name === attribute.name)
                                if (attr) {
                                    const nextIndex =
                                        attr.values
                                            .map(v => v.name)
                                            .indexOf(attr.selectedValueName) + 1
                                    attr.selectedValueName =
                                        attr.values[nextIndex]?.name || attr.values[0].name
                                    props.onAttributesChange(data)
                                }
                            }}
                        >
                            <KeyboardArrowRight />
                        </Button>
                    </ButtonGroup>
                </Grid>,
            ])}
        </Grid>
    )
}

export default AttributesSelectors
