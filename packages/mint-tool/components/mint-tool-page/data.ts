import { IAttributeDto } from 'packages/mint-tool/utils/nft-generator/types'
import * as googleApi from '../../utils/google-api'
googleApi.load()

export interface IAttributesData {
    collectionName: string
    layers: Array<{
        name: string
        folderId: string
        attributeName: string
    }>
    attributes: Array<IAttributeDto>
    images: Array<{
        name: string
        displayName: string
        imageUrl: string
        layerName: string
        attributeName: string
    }>
}

const getFilesInFolders = async (
    foldersIds: Array<string>,
    pageToken?: string
): Promise<Array<any>> => {
    const drive = await googleApi.getDriveClient()
    const result: any[] = []

    const q = foldersIds.map(id => `'${id}' in parents`).join(' or ')
    const files = await drive.files.list({
        q: `trashed = false and (${q})`,
        fields: 'nextPageToken,files(id,name,parents,mimeType, hasThumbnail, thumbnailLink)',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageToken,
        pageSize: 1000,
    })

    result.push(...(files.result.files as any))
    if (files.result.nextPageToken) {
        result.push(...(await getFilesInFolders(foldersIds, files.result.nextPageToken)))
    }

    return result
}

const getSubFolders = async (
    parentId: string,
    pageToken?: string
): Promise<Array<Record<string, unknown>>> => {
    const drive = await googleApi.getDriveClient()

    const subfoldersResponse = await drive.files.list({
        q: `trashed = false and '${parentId}' in parents`,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageToken,
        pageSize: 1000,
    })

    const result = [
        ...subfoldersResponse.result.files.filter(
            f => f.mimeType === 'application/vnd.google-apps.folder'
        ),
    ]

    if (subfoldersResponse.result.nextPageToken) {
        result.push(...(await getSubFolders(parentId, subfoldersResponse.result.nextPageToken)))
    }

    return result
}

export const getAttributesData = async (parentFolderId: string): Promise<IAttributesData> => {
    const drive = await googleApi.getDriveClient()

    // get folder name
    const folder = await drive.files.get({
        fileId: parentFolderId,
        fields: 'name',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
    })

    // initialize result
    const result: IAttributesData = {
        collectionName: folder?.result?.name,
        layers: [],
        attributes: [],
        images: [],
    }

    // get subfolder list
    const subfolders = await getSubFolders(parentFolderId)

    // parse subfolder names and data
    let parsedSubfolders: any[] = []
    for (const subfolder of subfolders) {
        const { name, id } = subfolder as any

        const [order, attributeName, details] = name
            .split(/ |-|_/gi)
            .map(p => p.trim())
            .filter(Boolean)

        parsedSubfolders.push({
            id,
            name,
            order: Number(order),
            attributeName,
            details,
        })
    }
    // order parse subfolders by order field
    parsedSubfolders = parsedSubfolders.sort((a, b) => a.order - b.order)

    // populate layers and attributes
    for (const subfolder of parsedSubfolders) {
        result.layers.push({
            name: subfolder.name,
            folderId: subfolder.id,
            attributeName: subfolder.attributeName,
        })

        const attribute = result.attributes.find(a => a.name === subfolder.attributeName)
        if (!attribute) {
            // TODO: get persisted data from local storage
            result.attributes.push({
                name: subfolder.attributeName,
                displayName: subfolder.attributeName,
                canMiss: false,
                values: [],
                selectedValueName: '[NONE]',
            })
        }
    }

    // get files from subfolders
    const files = await getFilesInFolders(parsedSubfolders.map(f => f.id))

    // process filess and add them in images array
    for (const file of files) {
        const { name, parents, thumbnailLink } = file as any

        const displayName = name
            .replace(/\.[a-z]+$/i, '') // remove extension from name
            .replace(/[-_]/gi, ' ') // replace separators with space

        const layer = result.layers.find(l => parents.indexOf(l.folderId) >= 0)
        if (layer && thumbnailLink) {
            const image = {
                name,
                displayName,
                imageUrl: thumbnailLink.replace(/s[0-9]+$/i, 's1200'),
                layerName: layer.name,
                attributeName: layer.attributeName,
            }
            result.images.push(image)

            // add image reference in attributes
            const attribute = result.attributes.find(a => a.name === layer.attributeName)
            if (attribute) {
                if (!attribute.values.find(v => v.name === name)) {
                    attribute.values.push({ name, displayName })
                }

                if (attribute.selectedValueName === '[NONE]') attribute.selectedValueName = name
            }
        }
    }

    return result
}
