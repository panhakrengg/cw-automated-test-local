import Field from '../../../../constants/Field'

class PreviewFileAssertion {
  popupSelector = {
    $el: `.preview-popup-wrapper`,
    title: `.preview-title`,
    img: `.image-wrapper img`,
    close: `.close-slide-show`,
    pdf: {
      btnPrevious: {
        id: `button#previous`,
        title: Field.PREVIOUS,
      },
      btnNext: {
        id: `button#next`,
        title: Field.NEXT,
      },
      btnZoomOut: {
        id: `button#zoomOut`,
        title: Field.ZOOM_OUT,
      },
      btnZoomIn: {
        id: `button#zoomIn`,
        title: Field.ZOOM_IN,
      },
      btnPrint: {
        id: `button#print`,
        title: Field.PRINT,
      },
      btnDownload: {
        id: `button#download`,
        title: Field.DOWNLOAD,
      },
      pageNumber: {
        id: `input#pageNumber`,
        title: '1',
      },
      numPages: {
        id: `span#numPages`,
        title: 'of 4',
      },
      scaleSelect: {
        id: `select#scaleSelect`,
        scale200: {
          title: `200%`,
          value: `2`,
        },
        scaleActual: {
          title: Field.ACTUAL_SIZE,
          value: `page-actual`,
        },
        scaleFit: {
          title: Field.PAGE_FIT,
          value: `page-fit`,
        },
      },
    },
  }

  getPopup() {
    return cy.get(this.popupSelector.$el)
  }

  assertIconButtonVisible(id, title) {
    this.getPopup().get(id).contains(title).parent().should('be.visible')
  }
  assertScaleSelectBox(id, title, value) {
    this.getPopup().get(id).select(title).should('have.value', value)
  }
  assertPreviewPopupButtons() {
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnPrevious.id,
      this.popupSelector.pdf.btnPrevious.title
    )
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnNext.id,
      this.popupSelector.pdf.btnNext.title
    )
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnZoomOut.id,
      this.popupSelector.pdf.btnZoomOut.title
    )
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnZoomIn.id,
      this.popupSelector.pdf.btnZoomIn.title
    )
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnPrint.id,
      this.popupSelector.pdf.btnPrint.title
    )
    this.assertIconButtonVisible(
      this.popupSelector.pdf.btnDownload.id,
      this.popupSelector.pdf.btnDownload.title
    )
  }
  expectToPreviewImage(name) {
    this.getPopup().get(this.popupSelector.title).contains(name).should('be.visible')
    this.getPopup().get(`${this.popupSelector.img}[alt="${name}"]`).imageResponseSuccess()
    this.getPopup().get(this.popupSelector.close).should('be.visible').click()
  }
  expectToPreviewPdf(name) {
    this.getPopup().get(this.popupSelector.title).contains(name).should('be.visible')
    this.assertPreviewPopupButtons()
    this.getPopup()
      .get(this.popupSelector.pdf.pageNumber.id)
      .should('have.value', this.popupSelector.pdf.pageNumber.title)
      .should('be.visible')
    this.getPopup()
      .get(this.popupSelector.pdf.numPages.id)
      .contains(this.popupSelector.pdf.numPages.title)
      .should('be.visible')
    this.assertScaleSelectBox(
      this.popupSelector.pdf.scaleSelect.id,
      this.popupSelector.pdf.scaleSelect.scale200.title,
      this.popupSelector.pdf.scaleSelect.scale200.value
    )
    this.assertScaleSelectBox(
      this.popupSelector.pdf.scaleSelect.id,
      this.popupSelector.pdf.scaleSelect.scaleActual.title,
      this.popupSelector.pdf.scaleSelect.scaleActual.value
    )
    this.assertScaleSelectBox(
      this.popupSelector.pdf.scaleSelect.id,
      this.popupSelector.pdf.scaleSelect.scaleFit.title,
      this.popupSelector.pdf.scaleSelect.scaleFit.value
    )
    this.getPopup().get(this.popupSelector.close).click()
  }
  expectToPreviewVideo(video, playbackRate, timeout) {
    this.getPopup().get(this.popupSelector.title).last().contains(video.name).should('be.visible')
    this.getPopup().expectHtmlVideoOfType(video.type)
    this.getPopup().htmlVideoHasDuration(video.duration)
    this.getPopup().htmlVideoCanPlay()
    this.getPopup().htmlVideoResponseSuccess()
    this.getPopup().htmlVideoHasEnded(playbackRate, timeout)
    this.getPopup().get(this.popupSelector.close).last().should('be.visible').click()
  }
  expectToSeeDownloadVideo(video) {
    cy.verifyDownload(video.name)
  }
  expectToSeeVaultFileToast(video) {}
}

export default PreviewFileAssertion
