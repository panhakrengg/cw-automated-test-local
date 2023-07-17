/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Select `iframe.cke_wysiwyg_frame`
     *
     * Find `body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr` then type
     * @param text
     */
    typeInEditor(text: string): void

    /**
     * Select `iframe.cke_wysiwyg_frame`
     *
     * Find `body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr` then clear
     * @param text
     */
    clearTextEditor(): void

    /**
     * Select `iframe.cke_wysiwyg_frame` by index
     *
     * Assert contains text
     * @param text
     * @param index of editor iframe
     */
    editorElementContain(text: string, index: number): void

    /**
     * Select `.cke_wysiwyg_frame` by index
     *
     * Assert contains text
     * @description editor inner text '\s' will replace by empty space
     * @param text
     * @param index
     */
    editorBodyContain(text: string, index: number): void

    /**
     * Select `.cke_top` then find the first `.cke_toolbox`
     * @alias aliasToolBar
     */
    getEditorToolBar(aliasToolBar: string): void

    /**
     * Select `@editorToolBar`
     *
     * Assert toolbar icons `be.visible`
     * @description need to call cy.getEditorToolBar() first
     * @param hasNoImageSelector true will check is visible
     */
    verifyEditorToolBar(hasNoImageSelector: boolean): void

    /**
     * Select `.cke_wysiwyg_frame`
     *
     * Assert `be.visible`
     *
     * @param element iframe editor
     */
    hasTextEditor(element: string): void
  }
}
