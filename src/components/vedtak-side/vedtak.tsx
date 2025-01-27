/* eslint-disable react-hooks/exhaustive-deps */

import { BodyLong, Heading } from '@navikt/ds-react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

import { ArkiveringContext } from '../../context/arkivering-context'
import { useUpdateBreadcrumbs, vedtakBreadcrumb } from '../../hooks/useBreadcrumbs'
import { RSDagTypeKomplett, RSVedtakWrapper } from '../../types/rs-types/rs-vedtak'
import { tekst } from '../../utils/tekster'
import Person from '../person/Person'
import { UxSignalsWidget } from '../ux-signals/UxSignalsWidget'
import Vis from '../vis'

import AnnulleringsInfo from './annullering/annullering'
import AvvisteDager from './avviste-dager/avviste-dager'
import { Behandling } from './behandling/behandling'
import Sykepengedager from './sykepengedager/sykepengedager'
import Uenig from './uenig/uenig'
import { PersonutbetalingMedInntekt } from './utbetaling/personutbetaling-med-inntekt'
import RefusjonMedInntekt from './utbetaling/refusjon-med-inntekt'

const dagErAvvist: RSDagTypeKomplett[] = ['AvvistDag', 'Fridag', 'Feriedag', 'Permisjonsdag', 'ForeldetDag']

export interface VedtakProps {
    vedtak: RSVedtakWrapper
}

const Vedtak = ({ vedtak }: VedtakProps) => {
    const router = useRouter()
    const erArkivering = useContext(ArkiveringContext)
    const query: NodeJS.Dict<string | string[]> = {}

    const annullertEllerRevurdert = vedtak.annullert || vedtak.revurdert
    const avvisteDager = vedtak.dagerArbeidsgiver.filter((dag) => dagErAvvist.includes(dag.dagtype))
    const erSP = vedtak.sykepengebelopPerson > 0
    const erSPREF = vedtak.sykepengebelopArbeidsgiver > 0
    const erAvvist = avvisteDager.length > 0

    useUpdateBreadcrumbs(() => [{ ...vedtakBreadcrumb, handleInApp: true }], [])

    useEffect(() => {
        // Scrollpoint beholdes når man går fra listevisning til vedtak. Nullstiller da det ser rart ut hvis vedtaket
        // er lengre enn det som vises i nettleser.
        window.scrollTo({ top: 0 })
    }, [])

    for (const key in router.query) {
        if (key != 'id') {
            query[key] = router.query[key]
        }
    }

    const studyKey = () => {
        if (erSP) {
            return 'study-y1ddhu1rch'
        }
        return 'study-7f70elp6c'
    }

    return (
        <>
            <Vis
                hvis={!erArkivering}
                render={() => (
                    <header className="sidebanner">
                        <Heading spacing size="xlarge" level="1" className="sidebanner__tittel">
                            {tekst('spinnsyn.sidetittel.vedtak')}
                        </Heading>
                        <Person />
                    </header>
                )}
            />

            <div className="limit">
                <Vis
                    hvis={!annullertEllerRevurdert}
                    render={() => (
                        <div className="velkommen">
                            <img src={'/syk/sykepenger/static/img/adult_people.svg'} alt="" />
                            <div className="velkommen-innhold">
                                <BodyLong size="medium">{tekst('vedtak.velkommen.tekst1')}</BodyLong>
                                <Vis
                                    hvis={erSP && erSPREF}
                                    render={() => <BodyLong size="medium">{tekst('vedtak.velkommen.tekst2')}</BodyLong>}
                                />
                            </div>
                        </div>
                    )}
                />

                <Vis
                    hvis={annullertEllerRevurdert}
                    render={() => (
                        <>
                            <AnnulleringsInfo vedtak={vedtak} />
                            <Heading spacing size="large" level="2" className="tidligere__beslutning">
                                {tekst('annullert.se-tidligere-beslutning')}
                            </Heading>
                        </>
                    )}
                />

                <Vis hvis={erSP} render={() => <PersonutbetalingMedInntekt vedtak={vedtak} />} />
                <Vis
                    hvis={erSPREF || (!erSP && !erSPREF && !erAvvist) /* vedtak med bare arbeidsgiverperiode dager */}
                    render={() => <RefusjonMedInntekt vedtak={vedtak} />}
                />
                <Vis
                    hvis={erAvvist}
                    render={() => (
                        <AvvisteDager avvisteDager={avvisteDager} vedtak={vedtak} heltAvvist={!erSP && !erSPREF} />
                    )}
                />

                <Sykepengedager vedtak={vedtak} />

                <Vis hvis={!erArkivering} render={() => <UxSignalsWidget study={studyKey()} />} />

                <Behandling vedtak={vedtak} />

                <Vis hvis={!annullertEllerRevurdert} render={() => <Uenig vedtak={vedtak} />} />
            </div>
        </>
    )
}

export default Vedtak
