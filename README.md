<div id="top"></div>


<div id="about-the-project"></div>

<!-- ABOUT THE PROJECT -->
## Web Programming 2022 Project

We want to create a web application that acts as a chrono diary of one's movements.
<br>
The application will allow a registered user to store information relating to their trips to view them later.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation-dev">Installation (dev)</a></li>
        <li><a href="#installation-prod">Installation (prod)</a></li>
        <li><a href="#installation-full">Installation (full-stack)</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<div id="built-with"></div>

### Built With

* [React](https://reactjs.org/)
* [Tailwind](https://tailwindcss.com/)
* [Koa](https://koajs.com/)
* [MongoDB](https://mongodb.com/)

<p align="right">(<a href="#top">back to top</a>)</p>


<div id="getting-started"></div>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

<div id="prerequisites"></div>

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
* docker
    * docker container running a MongoDB 

<div id="installation-dev"></div>

### Installation (Run Development Environment)

1. Clone the repository
   ```sh
    git clone https://github.com/MatteoScorcia/TripBook.git
   ```
2. Install NPM packages inside the cloned repository
   ```sh
      npm install
   ```
3. Enter your ENV variables in `src/api/.env`
   ```js
    PORT=<your-api-port>
    MONGODB_URI = <your-mongoDB-URI>
    SECRET_KEY = <your-secret-key-for-hashing-database-passwords>
   ```

4. Enter <your-api-port> in `src/app/package.json`
   ```sh
    ...
    "scripts": {
        ...
           "dev": "dotenv -v PORT=<your-app-port>-- react-scripts start"
    }
    "proxy": "http://localhost:<your-api-port>",
    ...
    ```
5. Run this script to save the [NUTS](https://ec.europa.eu/eurostat/web/nuts/background) database into your MongoDB 
   ```sh
    npm -w src/api run migrate "path to geojson NUTS file"
   ```

6. Run this script to build, run and watch for changes in the `app`, `dto` and `api` folders
   ```sh
    npm run dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<div id="installation-prod"></div>

### Installation (Build a single docker production ready)

1. Clone the repo
   ```sh
    git clone https://github.com/MatteoScorcia/TripBook.git
   ```

2. Run this command inside the repository to build the docker image from the Dockerfile
   ```sh
      docker build -t node:koa-api ./  
   ```

3. Run this command to build the docker container and run it in interactive mode with default ENV variables
   ```sh
      sudo docker run -it --init --rm -p 8888:4100 --name <container-name> node:koa-api
   ```
   
4. Run this command to build the docker container and run it in interactive mode with your ENV variables
   ```sh
      sudo docker run -it --init --rm -e PORT=<my-port> \
      -e MONGODB_URI="mongodb://<user>:<password>@<mongodb-url>:<mongodb-port>/<optional-db-name>" \
      -e SECRET_KEY="<my-secret-key>" \
      -e MIGRATE=<"true" | "false"> \
      -p 8888:4100 --name <container-name> node:koa-api
   ```
 
The SECRET_KEY is used to sign JWTs.
<br>
MIGRATE indicate if the docker should perform an insert of the NUTS.json into the MongoDB

<div id="installation-full"></div>

### Installation (Full Stack)

1. Clone the repo
   ```sh
    git clone https://github.com/MatteoScorcia/TripBook.git
   ```

2. Run this command inside the repository to build the docker containers from the docker-compose.yml
   ```sh
      docker compose up -d
   ```

<div id="license"></div>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
