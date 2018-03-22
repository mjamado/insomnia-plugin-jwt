# Insomnia JWT Creator

This is a plugin for [Insomnia](https://insomnia.rest/) that allows the
creation of JSON Web Tokens.

## Instalation

Install the `insomnia-plugin-jwtcreator` plugin from Preferences > Plugins.

## Usage

Add the `JSON Web Token Creator` template tag wherever you see fit and fill the
necessary fields. Whichever you'll leve empty won't be present in the token.

The recommended way to set up is to create environment variables to (at least)
`iss`, `sub` and `secret`, and use those variables inside the
`JSON Web Token Creator`.
