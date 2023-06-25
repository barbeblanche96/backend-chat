# blabber-backend

> blabber chat

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/blabber-backend
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

4. We can run on multiple ports for scaling

    ```
    PORT=3030 npm start
    PORT=3031 npm start
    PORT=3032 npm start
    ```

5. If you run on multiple port, you have to use nginx for load balancing. We can use this config in nginx.conf file. With this configuration, all three instances are runing on single port : http://localhost:3000, so use this new url for backend

    ```
	upstream blabber_backend {
		ip_hash;
    	server localhost:3030;
    	server localhost:3031;
    	server localhost:3032;
	}

	server {
		listen 3000;
		root path/to/blabber-backend;

		location / {
            proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection "upgrade";
			proxy_http_version 1.1;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header Host $host;
			proxy_pass http://blabber_backend;
		}
	}
    ```

6. Check backend documentation at this [Link](https://documenter.getpostman.com/view/3550891/2s93si1A3q)

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
