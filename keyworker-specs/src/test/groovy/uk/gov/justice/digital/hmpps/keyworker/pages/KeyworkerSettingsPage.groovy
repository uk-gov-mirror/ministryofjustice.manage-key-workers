package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class KeyworkerSettingsPage extends Page {


    static url = "/manage-key-worker-settings"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Manage key worker settings')
    }

    static content = {
        headingText { $('h1').first().text() }
        saveButton { $('#save-button') }
        backLink { $('a.backlink')}
        capacity { $('#capacity')}
        extCapacity { $('#extCapacity')}
        statusDiv { $('#status')}
        sequenceFrequencySelect { $('#frequency-select')}
        sequenceOptionOnceAFortnight { $('#option_once_a_fortnight')}
        messageBar(required: false) { $('div #messageBar')}
        errorMessage(required: false) { $('span.error-message')}
    }

}
