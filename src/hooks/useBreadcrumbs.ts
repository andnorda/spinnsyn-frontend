import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import { DependencyList, useCallback, useEffect, useRef } from 'react'

import { minSideUrl, publicPath, spinnsynFrontendInterne, sykefravaerUrl } from '../utils/environment'
import { tekst } from '../utils/tekster'

type Breadcrumb = { title: string; url: string }
type LastCrumb = { title: string }
type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0]

const baseCrumb: CompleteCrumb[] = [
    {
        title: 'Min side',
        url: minSideUrl(),
        handleInApp: false,
    },
    { title: 'Ditt sykefravær', url: sykefravaerUrl(), handleInApp: false },
    { title: tekst('vedtak-liste.sidetittel'), url: publicPath(), handleInApp: true },
]

function createCompleteCrumbs(breadcrumbs: [...Breadcrumb[], LastCrumb] | []): CompleteCrumb[] {
    const prefixedCrumbs: CompleteCrumb[] = breadcrumbs.map(
        (it): CompleteCrumb => ({
            ...it,
            url: 'url' in it ? `${publicPath()}${it.url}` : '/',
            handleInApp: true,
        }),
    )

    return [...baseCrumb, ...prefixedCrumbs]
}

export function useUpdateBreadcrumbs(makeCrumbs: () => [...Breadcrumb[], LastCrumb] | [], deps?: DependencyList): void {
    const makeCrumbsRef = useRef(makeCrumbs)

    useEffect(() => {
        if (spinnsynFrontendInterne()) {
            return
        }
        makeCrumbsRef.current = makeCrumbs
    }, [makeCrumbs])

    useEffect(() => {
        if (spinnsynFrontendInterne()) {
            return
        }
        ;(async () => {
            try {
                const prefixedCrumbs = createCompleteCrumbs(makeCrumbsRef.current())
                await setBreadcrumbs(prefixedCrumbs)
            } catch (e) {
                logger.error(`klarte ikke å oppdatere breadcrumbs på ${location.pathname}`)
                logger.error(e)
            }
        })()
        // Custom hook that passes deps array to useEffect, linting will be done where useUpdateBreadcrumbs is used
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}

export function useHandleDecoratorClicks(): void {
    const router = useRouter()
    const callback = useCallback(
        (breadcrumb: Breadcrumb) => {
            // router.push automatically pre-pends the base route of the application
            router.push(breadcrumb.url.replace(publicPath() || '', '') || '/')
        },
        [router],
    )

    useEffect(() => {
        if (spinnsynFrontendInterne()) {
            return
        }
        onBreadcrumbClick(callback)
    })
}

export const vedtakBreadcrumb = { title: tekst('vedtak.sidetittel') }

export enum SsrPathVariants {
    Root = '/',
    NotFound = '/404',
    ServerError = '/500',
    VedtakListe = '/',
    Vedtak = '/[id]',
    VedtakArkivering = '/vedtak/arkivering/[id]',
}

export function createInitialServerSideBreadcrumbs(pathname: SsrPathVariants | string): CompleteCrumb[] {
    switch (pathname) {
        case SsrPathVariants.Root:
        case SsrPathVariants.NotFound:
        case SsrPathVariants.ServerError:
        case SsrPathVariants.VedtakArkivering:
        case SsrPathVariants.VedtakListe:
            return createCompleteCrumbs([])
        case SsrPathVariants.Vedtak:
            return createCompleteCrumbs([vedtakBreadcrumb])
        default:
            logger.error(`Unknown initial path (${pathname}), defaulting to just base breadcrumb`)
            return createCompleteCrumbs([])
    }
}
