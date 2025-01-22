## About the project

TBD

## Development environment

1. Clone the repo
2. Run `npm i` to install dependencies.
3. Run `npm run dev` to launch the local development instance.

### Environment variables

1. MongoDb: Create a MongoDb Atlas account (in the cloud) (https://account.mongodb.com/account/login) and copy the connection string. You can also create a local instance of mongodb. Add the connection string to this environment variable `MONGODB_URI`. See (https://www.mongodb.com/docs/manual/reference/connection-string/).

2. Authentication: In your Google Cloud Console, setup Google Auth. Follow these instructions [Google Cloud Console](https://developers.google.com/identity/protocols/oauth2) and [NextAuth](https://authjs.dev/getting-started/providers/google). Remember to create the appopriate environment variables.

3. Follow a similar process to setup [Github w/ NextAuth](https://authjs.dev/getting-started/providers/github?framework=next-js). Remember to create the appopriate environment variables.

4. Create a `AUTH_SECRET` environment variable and populate it with a string of your choosing. it's used with NextAuth to generate a secret. <br>

## Our Team

- David Eastmond: [GitHub](https://github.com/davideastmond) / [LinkedIn](https://linkedin.com/in/david-eastmond-2783ab18a)
- Abigail Swarth: [GitHub](https://github.com/abby-wankenobi) / [LinkedIn](www.linkedin.com/in/abigailswarth)
- Sitora Everman [GitHub](https://github.com/sittora) / [LinkedIn](https://www.linkedin.com/in/sitora-everman/)
- Janelle Lopp [GitHub](https://github.com/Jnicolle98) / [LinkedIn](https://www.linkedin.com/in/janelle-lopp/)
- Sarita Kumari Jha [GitHub](https://github.com/Sarita1517) / [LinkedIn](https://www.linkedin.com/in/sjhabsc/)
- Sierra Swaby [GitHub](https://github.com/starkspark) / [LinkedIn](https://www.linkedin.com/in/sierra-swaby)
