import PostInteraction from "./PostInteraction";

class PostDetail {

    constructor() {
        this.postInteraction = new PostInteraction();
    }

    showTitle(text) {
        cy.get('.post-content-wrapper > .cec-card__body').should('contain', text)
    }

    clickLike() {
        this.postInteraction.clickLike()
    }
    writeComment(text) {
        this.postInteraction.writeComment(text)
        this.postInteraction.submitComment();
    }
}

export default PostDetail;