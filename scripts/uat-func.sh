#!/bin/bash
source a-entry.sh
cd .. && npm install && npm run cy:parallel:func:uat

cat << EOF > allure-results/environment.properties
Browser=$CHROME_VERSION
Stage=UAT
Test.Type=Functionality
Screen.Resolution=1280x720
EOF