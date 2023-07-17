#!/bin/bash
specs=$(<../.failedspecs/failed_specs.txt)
specs=${specs//",,"/","}

export CYPRESS_allureResultsPath='allure-results-failed'
