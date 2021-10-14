import { gapi } from 'gapi-script'
import { Deferred } from '@tiexohq/marketplace-common/utils/deferred'

const deferred = new Deferred()

export const load = () => gapi.load('client:auth2', initClient)
export const initClient = () =>
    gapi.client
        .init({
            apiKey: process.env.NEXT_PUBLIC_GAPI_API_KEY,
            clientId: process.env.NEXT_PUBLIC_GAPI_APP_CLIENT,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        })
        .then(() => {
            deferred.resolve(gapi.client.drive)

            return gapi.auth2.getAuthInstance().isSignedIn.get()
        })
        .catch(e => console.error(e))

export const getDriveClient = () => deferred.promise
