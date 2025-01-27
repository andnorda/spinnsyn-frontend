describe('Server vedtak', () => {
    it('laster siden med alt ekspandert ', () => {
        cy.visit('http://localhost:8080/syk/sykepenger/vedtak/arkivering/utvikling-arkivering')

        cy.contains('Svar på søknad').and('is.visible')
        cy.contains('Du kan lese mer om hvordan sykepengene beregnes i')
        cy.contains(
            'Sykepenger betales bare for dagene mandag til fredag. Jobber du lørdager og søndager, blir disse dagene likevel regnet med i sykepengene du får. Inntekten som du har på helgedagene, blir fordelt på ukedagene.',
        )
    })
})

export {}
