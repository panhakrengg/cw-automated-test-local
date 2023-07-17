#!/bin/bash

CHROME_VERSION=$(google-chrome --version)
Allure_ENV=allure-results/environment.properties

export CHROME_VERSION
export Allure_ENV
export CYPRESS_allureLogCypress=true
export CYPRESS_allureAttachRequests=true
export CYPRESS_video=false
