<h1 align="center">
    <img alt="GoStack Logo" src="https://res.cloudinary.com/directmidiasoftwares/image/upload/v1580224540/GitHub/bootcamp10_z7ct8j.png" />
    <br>
    <h2 align="center">FastFeet API</h2>
    <br>
    <img alt="FastFeet" src="https://res.cloudinary.com/directmidiasoftwares/image/upload/v1580238067/GitHub/logo_fastfeet_zq0fqp.png" /> 
</h1>

## :rocket: Technologies

This project was developed at the [RocketSeat GoStack Bootcamp](https://rocketseat.com.br/bootcamp) with the following technologies:

-  [Express](https://expressjs.com/)
-  [Nodemon](https://github.com/remy/nodemon#nodemon/)
-  [Sucrase](https://github.com/alangpierce/sucrase)
-  [EditorConfig](https://editorconfig.org/)
-  [DotEnv](https://github.com/motdotla/dotenv)
-  [Yup](https://github.com/jquense/yup)
-  [Eslint](https://eslint.org/docs/user-guide/getting-started)
-  [Prettier](https://prettier.io/)
-  [Sequelize](https://sequelize.org/v5/manual/getting-started.html)
-  [bcryptjs](https://www.npmjs.com/package/bcrypt)
-  [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)


## :information_source: How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js v10.16][nodejs] or higher + [Yarn v1.19][yarn] or higher installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/andrewmatheus/gostack10-desafio01.git

# Go into the repository
$ cd gostack10-desafio01

# Install dependencies
$ yarn install

# Install PostgresSql or Docker version 19.03.1
$ Case use Docker: docker run --name database -e POSTGRES_PASSWORD=master -p 5534:5432 -d postgres:11
$ Create database empty, 
$ Create archive .env, fill in data as .env.example
$ yarn sequelize db:migrate
$ yarn sequelize db:seed:all

# Run the app
$ yarn dev
```

## :memo: License
This project is under the MIT license. See the [LICENSE](https://github.com/lukemorales/react-rocketshoes/blob/master/LICENSE) for more information.

---

Made with ♥ by Andrew Matheus :wave: [Get in touch!](https://www.linkedin.com/feed/)

[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[vc]: https://code.visualstudio.com/
[vceditconfig]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
[Insomnia]: https://insomnia.rest/
