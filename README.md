# Dorset Inframe Cabinetry

## Overview

This project provides a website for Dorset Inframe Cabinetry (a trading name of Town & Country Joinery) with the aim of promoting a new product range consisting of standard design kitchen units in a range of different finishes.

The site includes an interactive kitchen 'planner' allowing units to be selected and placed within a kitchen room. The outer wall can include doors, windows and even archways. Further walls can also be placed within the kitchen space.

Once the design is complete, a formal estimate can be requested online, upon which a representative of the company will contact the prospective client, to arrange a detailed survey, to validate (or correct) the design and then to provide a formal quotation.

Users may also choose to request a quote for a set of units without arranging them in a kitchen design - for example to add to an existing, installed design.

## Architecture

The website is desigend as a Next.JS client-server application that uses a mix of server-side and client-side rendering to optimise page load times. The server part also supports a number of API routes to store and manage design models.

Data about the various cabinet styles and sizes is **not** held in the database but is hard-coded in JavaScript tables (arrays of objects). Whilst this means that changing the data requires deployment of a new software build, this is expected to be a rare event and the chosen approach results again in faster page load times.

When the website server components need to send automated emails, they use the Nodemailer package to do so. The way this is configured requires an SMTP 'mail relay' service. This is possibly the most flexible way of sending to any customer mailbox type, but it does require special support to avoid the emails being marked as spam.

## Contributing

The source code for the project is currently managed within a private Github repository, so developers need to be 'invited' to collaborate.

## Deployment

The project is not yet deployed to a production environment; this section will be updated when that has been done. (There is only a preview instance on Vercel.)
