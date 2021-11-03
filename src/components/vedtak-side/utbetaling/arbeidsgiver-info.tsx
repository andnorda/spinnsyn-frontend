import { Element, Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import { getLedetekst, tekst } from '../../../utils/tekster'
import { VedtakProps } from '../vedtak'

const ArbeidsgiverInfo = ({ vedtak }: VedtakProps) => {

    return (
        <section className="arbeidsgiver-info">
            <Element tag="h3" className="arbeidsgiver-info__tittel">
                {tekst('utbetaling.arbeidsgiver.tittel')}
            </Element>
            <Normaltekst className="arbeidsgiver-info__tekst">
                {getLedetekst(tekst('utbetaling.arbeidsgiver.tekst'), {
                    '%ARBEIDSGIVER%': vedtak.orgnavn
                })}
            </Normaltekst>
        </section>
    )
}

export default ArbeidsgiverInfo