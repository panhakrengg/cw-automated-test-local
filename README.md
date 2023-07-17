# I. Installation and Setup

### 1. Cypress dependencies on linux

https://docs.cypress.io/guides/getting-started/installing-cypress#UbuntuDebian

### 2. Git clone and switch to development branch

```
git clone git@github.com:Khalibre/cw-automated-test.git && git checkout cy-development
```

### 3. Install Node and The support version

Install n tool

```bash
sudo npm install -g n
```

Install node version 16

```bash
n 16.14.0
```

# II. Config password support for Studio and CLI

### 1. Config to run via Cypress Studio

1. Install package run="as a"

```bash
npm install --global as-a
```

2. Create a file then edit file ~/.as-a/.as-a.ini

3. Copy and paste information below Then change password

```bash
[local]
CYPRESS_cw_uat_pwd=your_password_here

[uat]
CYPRESS_cw_uat_pwd=your_password_here
CYPRESS_cw_ethereal_path=~/.ethereal/

[prd]
CYPRESS_cw_prd_pwd=your_password_here
```

### 2. Password configuration for parallel run

1. Create a new file following this path

```bash
sudo touch /etc/cypress-pwd.sh
```

2. Change file ownership

```bash
sudo chown yourusername:yourusername cypress-pwd.sh
```

3. Change file permission

```bash
sudo chmod u+x cypress-pwd.sh
```

4. Open `cypress-pwd.sh` add replace password

```bash
export CYPRESS_cw_uat_pwd="your_password_here"
export CYPRESS_cw_prd_pwd="your_password_here"
```

# III. Working With Report

### 1. Local install report

More info: https://github.com/allure-framework/allure2

Install global command

```bash
npm install -g allure-commandline --save-dev
```

### 2. Local view report

Go to your root project than cw-cypress

```bash
npx allure serve
```

# IV. Skip test on Production run

To skip any test cases on please use tag `@skipPrd`.

Usage:

1. on a whole spec

```
describe(Epic.Account, { tags: '@skipPrd' }, () => {})
```

2. on specific test case

```
it('Cw Normal User able to see filters', { tags: '@skipPrd' } , () => {})
```

Read more information @cypress/grep : https://github.com/cypress-io/cypress/tree/develop/npm/grep#readme

# V. Run only failed Specs

This utility collects all failed specs and run them either on local or Jenkins.

Step 1 - Run the smoke or func tests in beta or uat.

Step 2 - Run the script to run only failed test cases.

```bash
[local]
./scripts/run-beta-failed-specs.sh -- To run on BETA
./scripts/run-uat-failed-specs.sh -- To run on UAT

```

To clear old failed specs

```bash
./scripts/clear-failed-specs.sh
```

To see report

```bash
npx allure serve allure-results-failed

```

# VI. Configure remote running

1. Running via studio ensure that inside ~/.as-a/.as-a.ini add the line below

```bash
[local]
CYPRESS_cw_uat_pwd=your_password_here

```

2. (Skip) Running via cli ensure that in parallel run. Make sure follow section II

3. Add remote host and urls inside /etc/hosts

```bash
127.0.0.1	localhost

192.168.241.62 dev-account-10-10-10-10.crosswired.me
192.168.241.62 dev-authenticator-10-10-10-10.crosswired.me
192.168.241.62 dev-messaging-10-10-10-10.crosswired.me
192.168.241.62 dev-cnmchat-10-10-10-10.crosswired.me
192.168.241.62 dev-connect-10-10-10-10.crosswired.me
192.168.241.62 maildev-10-10-10-10.crosswired.me
192.168.241.62 dev-vault-10-10-10-10.crosswired.me
192.168.241.62 dev-office-10-10-10-10.crosswired.me
192.168.241.62 dev-learning-10-10-10-10.crosswired.me
```
