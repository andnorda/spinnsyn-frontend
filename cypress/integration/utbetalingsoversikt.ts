import { vedtakMed100Grad } from '../../src/data/mock/data/rs-vedtak'

describe('Tester visning av utbetalingsoversikt', () => {

    const vedtak = vedtakMed100Grad

    before(() => {
        cy.visit('http://localhost:8080/syk/sykepenger')
    })

    it('Laster startside', () => {
        cy.url().should('equal', 'http://localhost:8080/syk/sykepenger')
        cy.get(`article a[href*=${vedtak.id}]`).click()
    })

    it('Utbetalingsoversikt', () => {
        cy.contains('8 960 kroner')
            .and('contain', 'Utbetales til arbeidsgiveren')
            .click({ force: true })

        cy.contains('Daglig utbetalingsoversikt')
            .click({ force: true })

        cy.contains('24.01.21').parent().should('contain', 'Arbeidsdag').and('contain', '-')
        cy.contains('25.01.21').parent().should('contain', 'Arbeidsgiver betaler').and('contain', '-')
        cy.contains('08.02.21').parent().should('contain', 'Delvis syk').and('contain', '896')
        cy.contains('20.02.21').parent().should('contain', 'Helg').and('contain', '-')
    })

    it('Mer om dagtyper', () => {
        cy.get('.tekstinfo .etikett').should('have.text', 'Arbeidsgiver betaler' + 'Arbeidsdag' + 'Delvis syk' + 'Helg')
        cy.get('.tekstinfo .typo-normal').should('have.text',
            'Arbeidsgiveren din betaler de første 16 kalenderdagene av sykefraværet.' +
            'Det utbetales ikke sykepenger for hele dager du har vært på jobben.' +
            'Du får sykepenger for den delen av arbeidstiden du ikke jobber. Vi bruker opplysningene dine om hvor mye du jobbet i perioden.' +
            'Sykepenger betales alltid fra mandag til fredag. Om du jobber lørdager og søndager blir dette medregnet i totalbeløpet.'
        )
    })
})