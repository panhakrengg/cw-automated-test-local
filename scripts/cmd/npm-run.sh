#!/bin/bash

EPIC_PATH=$1
export CYPRESS_specPattern="cypress/e2e/functional/${EPIC_PATH}/**/**/*.cy.js"

npm run $2:func:$EPIC_PATH