# 0x-launchkit-frontend

Frontend example project for [`0x-launch-kit`](https://github.com/0xProject/0x-launch-kit): should serve as the foundation for developing Relayer UI components (React) and investigating the [0x](https://github.com/0xProject) protocol.

## Getting Started

Development takes place as a usual [`create-react-app`](https://github.com/facebook/create-react-app) project but listening for incoming requests on port `3001`. The project has been configured to proxy `'^/api'` requests to a running instance of `0x-launch-kit` that runs on `3000`.

To lunch the development server run the following commands (assuming `create-react-app` dependencies are in-place):

```
$ git clone https://github.com/protofire/0x-launchkit-frontend.git
$ cd 0x-launchkit-frontend
$ npm install
$ npm start
```

To start a [`0x-launch-kit`](https://github.com/0xProject/0x-launch-kit) instance, head to its GitHub page, clone the repository and follow the corresponding instructions.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Built With

-   [create-react-app](https://github.com/facebook/create-react-app) -
    Create React apps with no build configuration.
-   [bloomer](https://github.com/AlgusDark/bloomer) - A set of React components for Bulma

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
