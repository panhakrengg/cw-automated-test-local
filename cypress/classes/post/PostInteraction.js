class PostInteraction {
    clickLike() {
        cy.get('.cec-card__action-row > :nth-child(1) > .d-flex > .cw-icon').click();

    }
    writeComment(text) {
        cy.get('.cec-activity-post__add-comment > textarea').type(text + ' {enter}')
    }
    submitComment() {
        cy.get('.comment-icon > .lexicon-icon').click();
    }
    clickShare() {
        cy.get(':nth-child(3) > .d-flex > .lexicon-icon').click();
    }
    clickAnalytic() {
        cy.get(':nth-child(4) > a > .lexicon-icon').click();
    }
}

export default PostInteraction;