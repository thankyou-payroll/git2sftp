# git2sftp

CLI tool for deploying code from a Git repository via SFTP in a controlled way

## Prerequisites

- Git

## How to use it?

You can simply run it and the tool will guide you.

```bash
> git2sftp [options]
```

#### Environmental Variables

The environmental variables set the default answers. They can be set using a
`.env` file.

```bash
WORKSPACE=
GIT_REPOSITORY=
BRANCH=
SFTP_USER=
SFTP_PASSWORD=
SFTP_HOSTNAME=
SFTP_PORT=
SFTP_DEST=
```

#### Options:

You can use the options to preset the settings. If they are set the question
will be skipped.

```
  CLI tool for deploying code from a Git repository via SFTP in a controlled way

  usage:
    git2sftp [options]

  options:
    -w, --workspace     Select Workspace
    -h, --hostname      SFTP Hostname
    -u, --user          SFTP User
    -p, --password      SFTP Password
    --port              SFTP Port (Default: 22)
    -d, --dest          SFTP Remote Destiny
    -r, --repository    Git repository
    -b, --branch        Git branch (Default: master)
    -h, --help          Show Help
```

## Development

Simply clone the repository and run `yarn start` to run the app.

```bash
> git clone https://github.com/thankyou-payroll/git2sftp.git
> cd git2sftp
> yarn start
```

### Build

To generate a release using `nexe` just:

```bash
> yarn build
```
