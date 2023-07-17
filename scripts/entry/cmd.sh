#!/bin/bash

./cmd/install-packagejson.sh && 
./cmd/npm-run.sh $1 $2 &&
./cmd/allure-env-report.sh
