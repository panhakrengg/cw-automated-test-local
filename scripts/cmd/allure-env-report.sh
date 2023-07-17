#!/bin/bash
echo "--- Set allure report ---"

cd .. && cat > $Allure_ENV << EOF
Browser=$CHROME_VERSION
Screen.Resolution=1280x720
EOF
