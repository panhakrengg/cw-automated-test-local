#!/bin/bash

source entry/vars.sh
./cmd/install-packagejson.sh && 
./cmd/smoke-run.sh $1 &&
./cmd/allure-env-report.sh
