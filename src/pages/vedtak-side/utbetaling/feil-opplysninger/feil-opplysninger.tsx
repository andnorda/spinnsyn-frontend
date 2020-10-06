import { Element, Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import Utvidbar from '../../../../components/utvidbar/utvidbar'
import { useAppStore } from '../../../../data/stores/app-store'
import { tekst } from '../../../../utils/tekster'
import { klagefrist } from '../../../../utils/vedtak-utils'

const FeilOpplysninger = () => {
    const { valgtVedtak } = useAppStore()

    return (
        <Utvidbar erApen={false} tittel="Ved feil opplysninger" type="intern" className="tekstinfo">
            <Normaltekst className="tekstinfo__avsnitt">
                {tekst('utbetaling.opplysninger.inntektsmelding')}
            </Normaltekst>
            <Normaltekst className="tekstinfo__avsnitt">
                {tekst('utbetaling.opplysninger.beslutning')}
            </Normaltekst>
            <Element className="tekstinfo__avsnitt">
                {'Klagefrist: ' + klagefrist(valgtVedtak)}
            </Element>
        </Utvidbar>
    )
}

export default FeilOpplysninger
