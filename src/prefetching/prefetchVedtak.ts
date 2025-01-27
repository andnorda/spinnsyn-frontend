import getConfig from 'next/config'
import { QueryClient } from 'react-query'
import { dehydrate } from 'react-query/hydration'

import { beskyttetSide } from '../auth/beskyttetSide'
import { getOboAccessToken } from '../auth/getOboAccessToken'
import { hentModiaContext } from '../data/hentModiaContext'
import { hentVedtak } from '../data/hentVedtak'
import { hentVedtakFraSpinnsynBackendForInterne } from '../data/hentVedtakForInterne'
import { GetServerSidePropsPrefetchResult } from '../types/prefecthing'
import { spinnsynFrontendInterne } from '../utils/environment'

const { serverRuntimeConfig } = getConfig()

export const prefetchVedtak = beskyttetSide(async (ctx): Promise<GetServerSidePropsPrefetchResult> => {
    let sykmeldtFnr: string | null = null
    const queryClient = new QueryClient()
    if (spinnsynFrontendInterne()) {
        sykmeldtFnr = await hentModiaContext(ctx.req!)

        if (sykmeldtFnr) {
            const oboSpinnsynBackend = await getOboAccessToken(
                ctx.req?.headers.authorization?.split(' ')[1],
                serverRuntimeConfig.spinnsynBackendClientId,
            )

            await queryClient.prefetchQuery('vedtak', () => {
                return hentVedtakFraSpinnsynBackendForInterne(oboSpinnsynBackend, sykmeldtFnr!)
            })
        }
    } else {
        await queryClient.prefetchQuery('vedtak', () => {
            return hentVedtak(ctx.req!)
        })
    }
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            sykmeldtFnr,
        },
    }
})
