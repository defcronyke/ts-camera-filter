# Telephone Sound Camera Filter

This is the latest audio-reactive camera filter project by the band [Telephone Sound](https://telephonesound.com).

Run this web app on a device with a screen, webcam, and microphone, and it will allow you to visualize your environment through the sounds or music in the area around you.

## Online

You can run the web app online here: [https://defcronyke.github.io/ts-camera-filter](https://defcronyke.github.io/ts-camera-filter)

Once it finishes loading on your device from the above URL, the web app will run completely offline and will not send any webcam or microphone data over the internet.

## Offline

You can also run the web app locally offline or share it over your LAN, by first installing Node.js through your package manager or from here: [https://nodejs.org](https://nodejs.org),
and then installing the web app using either git or the zip distribution.

### Install With Git

To install the web app using git, run the following commands:
```bash
git clone https://github.com/defcronyke/ts-camera-filter.git
cd ts-camera-filter
npm i
```

### Install With The ZIP Distribution

Alternately, if you don't want to use git, you can just download the latest version of this project here: [https://github.com/defcronyke/ts-camera-filter/archive/master.zip](https://github.com/defcronyke/ts-camera-filter/archive/master.zip)

Unzip that file somewhere, and now there will be a new folder called ts-camera-filter-master. Run the following commands to initialize the zip distribution:
```bash
cd ts-camera-filter-master
npm i
```

### Run The Web App

The npm i command will take a few minutes, because it's downloading and installing everything that's needed to run the web app. Once it's done, you can run the offline version of the webapp whenever you want by running this command from inside the project's directory:
```bash
npm start
```

Your web browser will probably open a new tab now which is running the web app offline, but if it doesn't, you can manually browse to: [http://localhost:3000](http://localhost:3000)

### Run Over Local Area Network

For your convenience, the web app is also made available to your Local Area Network (LAN), so you can access it from other computers on your network by browsing to: [http://\<your-computer-ip\>:3000](http://<your-computer-ip>:3000)  (make sure to replace \<your-computer-ip\> with the IP address of the computer that is running the npm start command)

### Updating

To update to the latest version of this project, if you originally cloned it with git, just run these commands from inside the project directory:
```bash
git pull
npm i
```

If you downloaded the zip distribution, simply download again from the link above at any time, and you will receive the latest version.

----------

### Part of [https://eternalvoid.net](The Eternal Void Network)

----------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
