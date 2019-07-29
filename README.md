# git2sftp

CLI tool for deploying code from a Git repository via SFTP in a controlled way

## Prerequisites

- Git

## How to use it

You can simply
[download it from here](https://github.com/thankyou-payroll/git2sftp/releases)
and run it, the tool will guide you through the process.

```bash
> git2sftp [options]
```

### Rollback

You can also easily rollback a change to its previous state using the `rollback`
command.

```bash
> git2sftp rollback [options]
```

### Environmental Variables

The environmental variables set the default answers. They can be set using a
`.env` file.

```bash

# Defaults

WORKSPACE=
SFTP_USER=
SFTP_PASSWORD=
SFTP_HOSTNAME=
SFTP_PORT=22
SFTP_DEST=/app
GIT_REPOSITORY=
BRANCH=master
ENCRYPTION_KEY=git-to-sftp-big-secret
ENCRYPTION_ALGORITHM=aes-256-cbc
ENCRYPTION_IV_LENGTH=16
ENCRYPTION_PREFIX=Git2SFTP Rules!
```

### Options

Some of the options to preset the settings. If they are set the question will be
skipped.

```bash
-w, --workspace     Select Workspace
-h, --hostname      SFTP Hostname
-u, --user          SFTP User
-p, --password      SFTP Password
--port              SFTP Port (Default: 22)
-d, --dest          SFTP Remote Destiny
-r, --repository    Git repository
-b, --branch        Git branch (Default: master)
-h                  Show Help
-v                  Show Version
```

## Development

Simply clone the repository and run `yarn start` to run the app.

```bash
> git clone https://github.com/thankyou-payroll/git2sftp.git
> cd git2sftp
> yarn
> yarn start
```

### Build

To generate a release using `nexe` just:

```bash
> yarn build
```

## Encrypted Credentials

To keep your credentials safe you can specify your personal `ENCRYPTION_KEY` and
`ENCRYPTION_PREFIX` when running the command

```bash
> ENCRYPTION_KEY="🔑🗝️" ENCRYPTION_PREFIX="🔥🔥🔥🔥🔥" git2sftp [options]
```

The file `.creds` will be created the first time you save a credentials.
