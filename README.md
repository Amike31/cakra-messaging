## Outline

| Name | Desc |
|----------|----------|
| Framework | ReactJs, Firebase, MUI |
| Made By | Rahmat Rafid Akbar |
| Purpose | Cakra AI Hiring Assesment |

## Terminal Commands

1. Download and Install NodeJs LTS version from [NodeJs Official Page](https://nodejs.org/en/download/).
2. Navigate to the root ./ directory of the product and run `yarn install` or `npm install` to install our local dependencies.
3. Run `npm start` to begin development server.

### What's included

Within the download you'll find the following directories and files:

```
material-kit-2-react
    ├── public
    │   ├── icon.png
    │   ├── favicon.png
    │   ├── logoXXX.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src
    │   ├── pages
    │   │   ├── SignIn.js
    │   │   ├── Register.js
    │   │   ├── Room.js
    │   │   └── Chat.js
    │   ├── utils
    │   │   ├── firebaseConfig.js
    │   │   └── speechRecognitionHooks.js
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   └── logo.svg
    ├── .gitignore
    ├── package.json
    └── README.md
```

### What's implemented

1. User authentication (username and password)
2. Real-time messaging
3. Displaying messages in a conversation thread
4. Sending and receiving emojis
5. Basic styling and layout
6. Web Service using **Firebase**, but only use the firestore service since FCM is only available for mobile
7. Speech-to-Text (english-US language)
8. Semi Own Messaging Web Service -> utilize frontend logic and database management

### What's can be improved

1. Styling
2. Form Validation using Yup and formik
3. LLM Model for virtual assistant
4. User exist display

### Disclaimer

1. Web Service is self-made and not hosted due to lack of credit (free-trial acc has been used)
2. AI Model is substituted by default Speech-to-Text service (lack of credit)
3. Speech-to-Text feature is only supported in common web browser, such as Chrome

### Time Spent

| Activities | Time (Minutes) |
|----------|----------|
| Architecture design, research, and service config   | 60 |
| Development and testing   | 150 |