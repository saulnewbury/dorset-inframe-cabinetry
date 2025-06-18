# Deployment

## Overview

The Dorset Inframe Cabinetry website is a NextJS 'application' that is served from a NodeJS back-end into a standard web browser (front end). It uses React server-side rendering but mostly comprises 'client' components. These are first rendered to HTML on the server and then 'rehyrdated' in the browser to restore interactivity.

The NodeJS server responds to HTTP requests and provides appropriate responses. The initial response for any page a 'bootstrap' loader that can then fetch and rehydrate other pages. The server also handles non-page (API) requests, for which it typically provides a JSON-encoded (JavaScript object) response.

The NodeJS server communicates with a PostgreSQL database for persistent data storage. Some hosting services (such as cloud or VPS) offer managed database instance as a service; in other cases, an instance of the Postgres DBMS must be run 'alongside' the NodeJS server.

Because the web server module in NodeJS are not 'hardened' against malicious attack, it is best not to expose it directly to the internet. Instead, the NodeJS server should sit behind an 'application firewall', the simplest option for which is an instance of the Nginx web server, configured as a pass-through proxy. Some hosting platforms include a protective 'ingress' service; others (such as virtual private server or VPS) do not.

## NextJS Server

The server component is built as a standard NodeJS project, defined by a `package.json` configuration file. Once all the required files are assembled on a build server, the following `npm` commands must be used:

```sh
% npm ci
% npm run build
```

The first installs all required Node modules (supporting packages) and the second runs the NextJS 'build' process to create a production build in the folder `.next`. This folder plus the contents of `node_modules` and the `package.json` file must be copied to the destination server and then the following command can be used to run the production service:

```sh
% npm run start
```

## Automatic Restart

Depending on the deployment platform, automatic restart of the application may be 'built in'. On a VPS, though, consider using a solution such as PM2 to ensure that if the server is rebooted, the application will be restarted automatically as well.

## Environment Variables

The production NextJS service requires a number of environment variables to be set. These can be defined directly (e.g. as deployment secrets) or via a file called `.env` alongside `package.json`. The latter method should only be used when deploying to secure environment such as a VPS. The following values are required:

| Name          | Value                                                                      |
| ------------- | -------------------------------------------------------------------------- |
| DATABASE_URL  | PostgreSQL connection string for the Prisma ORM (see below)                |
| SMTP_HOST     | Relay host for outgoing email                                              |
| SMTP_PORT     | SMTP port number to use                                                    |
| SMTP_USER     | Username for outgoing SMTP access                                          |
| SMTP_PASSWORD | Password corresponding to given user                                       |
| SMTP_ORIGIN   | 'From' address to use for outgoing emails                                  |
| SMTP_MAILBOX  | 'To' address for submitted model emails to the company                     |
| CONTACT_EMAIL | 'To' address for contact requests to the company                           |
| SALT_BASE     | Random text string to add to hashed passwords to make them harder to crack |

If Google reCAPTCHA is to be used to block robots from spamming the business via the website, the following should also be set:

| Name                           | Value                                                            |
| ------------------------------ | ---------------------------------------------------------------- |
| RECAPTCHA_SECRET_KEY           | Server secret for the reCAPTCHA service instance                 |
| NEXT_PUBLIC_RECAPTCHA_SITE_KEY | Site key for the reCAPTCHA service instance                      |
| RECAPTCHA_API_KEY              | Google-generated 'API key' with permission for the reCAPTCHA API |

Note that these values are all highly sensitive (bar the reCAPTCHA site key) and should never be committed to a source control platform such as Github, or left in a Docker container that might be accessible to other users.

## Database

The production database must be created manually, along with a user (with username and password) having full access to create, drop and modify tables and indexes, as well as data within them. Consult the instructions for the database service to determine how, then, to place the connection information into a suitable URL.

Typically (for Prisma) the URL has the following form:

```
postgresql://username:password@localhost:5432/databasename?schema=public
```

where `username`, `password` and `databasename` should be replaced with appropriate values.

Sometimes, the DBMS host address (`localhost:5432` above) must also be replaced and sometimes other elements must be added.

Note that all the required tables and indexes will be created by Prisma on running the following command:

```sh
% npm prisma migrate deploy
```

This command should be run in a context that has access to the database, each time a new 'build' is produced. It updates the database to match the schema that will be built into the NextJS production code.

## Nginx Proxy

Setting up Nginx to act as a reverse proxy (application firewall) is a complex topic and not one for a document like this. Please ensure that whoever does it has the necessary expertise. In particular, the configuration needs to provide the SSL certificate and private key that will be used to secure browser connections.

SSL certificates typically have a limited lifetime (90 days) and must then be replaced with a new certificate and key. If using a service like LetsEncrypt, an ACME client such as `certbot` can be set up to run periodically, to update the certificate and key automatically.

## Deployment Automation

Again, this is a somewhat complex topic but if the source code is stored in Github (or a similar control system), it is then possible to create an automated deployment script that performs the following steps:

1. Extract the source files from the control system repository
2. Build a new release of the application
3. Deploy the resulting files to an appropriate hosting service
4. Stop the current website service
5. Update (migrate) the database schema and then
6. Restart the application using the new build.
