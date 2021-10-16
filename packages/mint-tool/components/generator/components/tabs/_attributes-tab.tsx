import { IAttributesData } from 'packages/mint-tool/components/mint-tool-page/data'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { useState } from 'react'
import { klona } from 'klona/json'
import NftPreview from 'packages/mint-tool/components/nft-preview/nft-preview'

interface IProps {
    data: IAttributesData | undefined

    onDataUpdate?: (data: IAttributesData) => void
}

const AttributesTab: React.FC<IProps> = ({ data, onDataUpdate }: IProps) => {
    const [selectedTab, setSelectedTab] = useState<string>(data?.attributes[0]?.name || '')

    return (
        <>
            <Typography variant="h5">Attributes</Typography>
            <Grid container>
                <TabContext value={selectedTab}>
                    <Grid item xs={2} sx={{ borderRight: 1, borderColor: 'divider' }}>
                        <TabList
                            orientation="vertical"
                            onChange={(e, newValue) => setSelectedTab(newValue)}
                            aria-label="lab API tabs example"
                        >
                            {data?.attributes.map((attribute, index) => (
                                <Tab
                                    key={`attribute-tab-${index}`}
                                    label={attribute.displayName}
                                    value={attribute.name}
                                />
                            ))}
                        </TabList>
                    </Grid>
                    <Grid item xs={10}>
                        {data?.attributes.map((attribute, index) => (
                            <TabPanel
                                value={attribute.name}
                                sx={{ paddingTop: 0 }}
                                key={`attribute-tab-content-${index}`}
                            >
                                <Typography variant="h6">Attribute settings</Typography>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={attribute.canMiss}
                                                onChange={event => {
                                                    const newData = klona<IAttributesData>(data)
                                                    const attr = newData.attributes.find(
                                                        a => a.name === attribute.name
                                                    )
                                                    if (attr) {
                                                        attr.canMiss = event.target.checked
                                                    }
                                                    typeof onDataUpdate === 'function' &&
                                                        onDataUpdate(newData)
                                                }}
                                            />
                                        }
                                        label="Allow undefined"
                                    />
                                </FormGroup>
                                <Typography variant="h6">Visuals</Typography>
                                <Grid container spacing={2}>
                                    {data.attributes
                                        .find(a => a.name === attribute.name)
                                        ?.values.map(({ name, displayName }, index) => (
                                            <Grid
                                                item
                                                key={`attribute-image-${index}`}
                                                xs={2}
                                                sx={{ height: 300 }}
                                            >
                                                <NftPreview
                                                    images={data.images
                                                        .filter(
                                                            img =>
                                                                img.attributeName ===
                                                                    attribute.name &&
                                                                img.name === name
                                                        )
                                                        .map(img => img.imageUrl)}
                                                />
                                                {displayName}
                                            </Grid>
                                        ))}
                                </Grid>
                            </TabPanel>
                        ))}
                    </Grid>
                </TabContext>
            </Grid>
        </>
    )
}

export default AttributesTab
