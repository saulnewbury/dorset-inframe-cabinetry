# Development Cycle

## Overview

When a new release is planned, a release manager creates a new 'release candidate' branch from the `main` branch.

The main cycle then proceeds as follows, for each feature/fault (or group of such):

- A developer is assigned to the feature/fault.
- The developer checks out the latest or selected base code on the release candidate branch.
- They update their local environment (Node modules and database) in line with the base code.
- They create a new branch (locally), based on that code.
- They develop and test a set of changes, on their local branch.
- If they need to share partial changes with other developers, they 'push' the new branch to the central repository.
- If the change requires an update to the Prisma schema, they create a new 'migration'.
- They ensure all updates on the new branch are `pushed' to the central repository.
- An independent tester is then assigned to verify the update.
- The tester checks out the new branch and updates their environment as per above.
- If there are faults, the tester collaborates with the developer to fix them.
- When the tester is satisfied, the developer 'merges' the new branch into the release candidate branch.

As a simplification of the above (e.g. for a small change), developers may work directly on the release candidate branch but they should then be very careful that any updates they push will not impede the work of others.

When the new realease is scheduled, a tester is assigned to check there has been no regression:

- The tester checks out the release candidate branch and updates their environment as above.
- The tester verifies that none of the updates that have been merged since the last release has caused 'regression' (new faults) that should delay the release.
- If there is regression, the tester collaborates with the developers of the respective updates to 'fix' the issue(s). Any changes are pushed back to the release candidate branch as above.
- When the tester is satisfied that the release is 'ready', they merge the release candidate branch back into the `main` branch and either trigger or perform a corresponding update to the production environment.

In the **rare** event that an urgent release must be made whilst another release candidate is still under development, that change **must** be merged into the active release candidate branch (and regression tests repeated) **before** it is merged back into the `main` branch.

## Database Updates

Developers should familiarise themselves with the use of 'migrations' to transmit changes from a development cycle into the production database. They should understand how to update their own development environment after they have checked out a change to the schema and they should understand how to create a new migration if they have had to change the schema themselves.

Both of the above operations are carried out via the same, Prisma command:

```sh
% npx prisma migrate dev
```

If this command detects that the local database is out of step with the current set of migrations (and the schema on which they are based), it will notify the user of this fact and recommend that the database be 'reset'. This will delete all data, which may in fact be desirable; otherwise the developer should take steps to 'dump' their data and reload it after the reset.

## Testing

This document does not prescribe any method of testing - nor any tools to be used. However, **at a minimum** it is essential that a production build be attempted:

```sh
% npm run build
```

This verifies that a clean build can be produced. Any further testing should then use this build (rather than running the dev server):

```sh
% npm start
```

The reason for this is discipline is that there can be minor (but important) differences of behaviour between a development and a production (or pre-production) build. In the former, for instance, React and NextJS check that various 'rules' are being obeyed; they emit console warnings if not. React also calls 'effect' handlers at least twice, to help developers find and remove undesirable side-effects. Those checks are removed in the production build.
