import { AmplitudeClient } from 'amplitude-js'

import { amplitudeEnabled } from '../../utils/environment'

interface AmplitudeInstance {
    logEvent: (eventName: string, data?: any) => void
}

let amplitudeInstance: AmplitudeInstance | undefined

const getLogEventFunction = (): AmplitudeInstance => {
    if (window && amplitudeEnabled()) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const amplitudeJs = require('amplitude-js')
        const amplitudeInstance: AmplitudeClient = amplitudeJs.default.getInstance()
        amplitudeInstance.init('default', '', {
            apiEndpoint: 'amplitude.nav.no/collect-auto',
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
            batchEvents: false,
        })
        return amplitudeInstance
    } else {
        return {
            logEvent: (eventName: string, data?: any) => {
                // eslint-disable-next-line no-console
                console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(data)}!`)
            },
        }
    }
}

export type validEventNames = 'navigere' | 'accordion lukket' | 'accordion åpnet' | 'skjema åpnet' //Bruk kun navn fra taksonomien

export const logEvent = (eventName: validEventNames, eventProperties: Record<string, string | boolean>) => {
    if (window) {
        if (amplitudeInstance) {
            amplitudeInstance.logEvent(eventName, eventProperties)
        } else {
            amplitudeInstance = getLogEventFunction()
            amplitudeInstance.logEvent(eventName, eventProperties)
        }
    }
}
