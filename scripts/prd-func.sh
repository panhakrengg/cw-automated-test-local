#!/bin/bash
CHROME_VERSION=$(google-chrome --version)
source a-entry.sh

cd .. && npm install && npm run cy:parallel:func:prd

cat << EOF > allure-results/environment.properties
Browser=$CHROME_VERSION
Stage=Production
Test.Type=Funtionality
Screen.Resolution=1280x720
EOF