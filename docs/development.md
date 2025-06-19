# Development Environment

The Dorset Inframe Cabinetry website is built as a NextJS client-server applicaton. It uses primarily JavaScript (as ES modules) - rather than TypeScript - for coding, within a React framework. It uses the NextJS 'App' router, which means that all code for pages (even static ones) can be found under the `/app` folder. Using NextJS also means it is a NodeJS project and therefore has a `package.json` file to define dependencies.

In order to run a local copy of the app for development and testing, it is necessary to apply the following steps.

## 1. Install NodeJS

It is recommended to install the current 'Long Term Support' version of NodeJS and there are many ways to do that:

- One can download an installer from the [NodeJS](https://nodejs.org/en/download) website.
- On a Mac, one can use `brew install node`. (First install [Homebrew](https://brew.sh) itself.)
- On Linux, one can install the standard `node` package.
- One can download and install `nvm` (Node Version Manager).

The latter is generally the better option for a developer, as it enables one to upgrade Node or switch between versions with greater ease than the other options - but it's a matter of choice.

## 2. Install DevTools

You will need at least the basic 'git' source code management tool. As with NodeJS, there arte a number of different ways to get it:

- On a Mac, one can install the XCode Command Line tools.
- On Linux, one can install the package `devtools`.
- Or one can download an installer from the [git-scm](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) website.

## 3. Install Visual Studio Code

Whilst any other integrated development environment (IDE) could be used, if you don't already have a favourite then the VSCode tool is highly recommended. It includes a wide range of plugins, including one for Prisma that supports code highlighting and error checking in the `schema.prisma` file(s).

You can get VSCode from the [VSCode](https://code.visualstudio.com) website.

## 4. Clone the Code Repository

Open VSCode and follow the propmpts to clone a Github repository. The URL is https://github.com/saulnewbury/dorset-inframe-cabinetry.git.

Choose an appropriate location on a local drive, where the project files will be placed.

## 5. Install Node Modules

Open a 'terminal' in VSCode (or in your native operating system). Navigate to the above project folder (if necessary) and run the following command:

```sh
% npm install
```

## 6. Create a Database

The Prisma schema file expects to use a PostgreSQL database, so you should install a local copy of that software. Again there are multiple options:

- Install from the [PostgreSQL](https://www.postgresql.org/download/) website.
- On a Mac, add with Homebrew.
- On Linux, install the standard `postgres` package.

Follow the [PostgreSQL documentation](https://www.postgresql.org/docs/current/) to create a new database 'role' (user) with password authentication and then create a new database owned by that role, e.g.:

```sh
% createuser -d -P dorsetdev
% createdb -O dorsetdev dorset
```

The first of these commands creates a new user (role) called `dorsetdev` with permission to create new databases. (The latter is necessary because it's how Prisma tracks schema changes to create 'migration' files for the production database.) The `createuser` command will prompt for entry of a password for the user.

The second command creates a new database called `dorset` that is owned by the above user.

Once the database exists, create a connection string for it and place that into a file called `.env`, thus:

```env
DATABASEURL=postgres://dorsetdev:password@localhost:5432/dorset
```

Replace the user (role) name [`dorsetdev`], password [`password`] and database name [`dorset`] as appropriate.

Save that file alongside the `package.json` file at the top level of the project and then run the folllowing command in a terminal window (in that folder):

```sh
% npx prisma migrate reset
```

This will reset the database, apply all migrations and then (if configured) run a 'seed' command to load initial data. At present, the Dorset Inframe Cabinetry website does not need any initial data, but it might in future.

## 7. Configure an Email Test Service

It is perfectly possible to test the Dorset Inframe Cabinetry website without an email test service. Any action that would normally send an email to the business will fail, but that may be ok. Otherwise apply this step.

An email test service such as [Mailtrap](https://mailtrap.io) or [Imitate-email](https://imitate.email) allows software under development to send emails to a dedicated mailbox, after which they can be viewed and deleted. The destination ('to' address) is visible but ignored. Some (including the two above) allow a small number of free tests every week.

Once you have the details of the test mailbox, add them to the `.env` file as follows:

```env
SMTP_HOST="host-dns-name"
SMTP_PORT=host-port
SMTP_USER="mailbox-username"
SMTP_PASSWORD="mailbox-password"
```

Obviously replace the values above with those provided by the email test service.

Also set the following:

```env
SMTP_ORIGIN="info@dorsetinframe.co.uk"
SMTP_MAILBOX="orders@dorsetinframe.co.uk"
CONTACT_EMAIL="contact@dorsetinframe.co.uk"
```

The above email addresses do not need to be 'real'; they are only used for testing.

It is not recommended to use your normal email account for testing. Some, such as Google, require an extra authentication step for which the software is not currently configured. Others may block your mailbox if they sense abuse that they class as potential spamming.

## 8. Complete `.env` File

Add the following line to the `.env` file to complete setup:

```env
SALT_BASE="any-random-string"
```

The value is used in creating 'hashed' versions of passwords, so its actual content does not matter.

## 9. Run and Test

Start the NextJS development server via the following command:

```js
% npm run dev
```

Note the URL that is displayed and connect using your preferred browser. The site has been tested with Safari, Chrome, Firefox and Edge; other browsers should also 'work' if they support HTML5, CSS3 and ES6 Javascript (2023+).

If you want to view or test the app on a mobile device, just find the IP address of the PC where the dev server is running, and connect to that. (Connecting to `localhost` won't work on another device.)
