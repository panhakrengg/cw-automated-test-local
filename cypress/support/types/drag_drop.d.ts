/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Reuse the existing cy.dragdrop
     * @param clientX
     * @param clientY
     * @param index
     */
    dragdropElement(clientX: number, clientY: number, index: number): void

    /**
     * Select `.dragdrop` by index then use mouse event
     * @param clientX
     * @param clientY
     * @param index
     */
    dragdrop(clientX: number, clientY: number, index: number): void

    /**
     * Select `.cw-dropzone-has-thumbnail`
     */
    getDragDropThumbnail(): void

    /**
     *
     * @param title assert contain
     * @param supportFile assert `Supported files: ` to contain
     * @param maxSize assert `Maximum size ` to contain
     */
    verifyDragDropThumbnail(title: string, supportFile: string, maxSize: string): void

    /**
     * Select `input.cw-dropzone-file` then attach file from fixture
     * @param fileName must be `video/mp4`
     */
    dropVideoFile(fileName: string): void


    /**
     * Select `.cw-dropzone`
     * 
     * Assert `have.class` border, border-style-dash
     * 
     * Select `.cw-dropzone-content` and find `button`
     * 
     * Assert `be.visible` and button contain btnName
     * 
     * Select `.cw-dropzone-drop-area > input[type="file"]`
     * 
     * Assert `not.be.visible`
     * @param btnName default is `Select Files`
     */
    verifyDropZoneArea(btnName: string): void
  }
}
