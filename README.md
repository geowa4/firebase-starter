Firebase Starter
================

Think of this like a little boilerplate.
This currently assumes you know how to user Firebase.

Getting Started
---------------

The first step is to create a Firebase project (https://firebase.google.com/).
Be sure to enable Google Authentication.
Next, we'll need some tooling.

```
npm install -g firebase-tools
```

Within `app/`, run `firebase serve` and open your browser to `http://localhost:5000/`.

When everything looks good, deploy it by running `firebase deploy`.

TODO
----

There aren't many external dependencies and the code is small so I've opted to avoid a build pipeline for now.
If this is to be a true boilerplate, that will need to change.

Related to the build pipeline, this application assumes latest Chrome.
A build tool could include BableJS so it can target lower browsers.

