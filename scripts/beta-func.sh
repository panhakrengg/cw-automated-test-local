#!/bin/bash
source a-entry.sh
cd .. && npm install && npm run cy:parallel:func:beta

cat << EOF > allure-results/environment.properties
Browser=$CHROME_VERSION
Stage=BETA
Test.Type=Funtionality
Screen.Resolution=1280x720
EOF