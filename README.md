**SETUP INSTRUCTIONS**

1. Install react vite app then Tailwind CSS in it and add in your vite.config.js also import in index.css
2. Now create different components as required:
   AppHeader,
   Button,
   StatusDot (To represent the status of streaming),
   MetaCard (To show Resolution, FPS and Display type),
   Steps (To show the progress of Screen-sharing that is Permission → Preview → Lifecycle),
   PermissionPrompt (Custom browser-style permission dialog box where you can select the option of allowing the screen sharing type that is  "Allow while visiting","Allow this time","Don't allow"),
   FullscreenOverlay (To view the screen sharing on full screen),
3. Create constants.js to represent the Permission states
4. Make useScreenShare.js file to create hooks, where all the logic of ScreenTestPage is written
5. Now create two pages one form landing (HomePage for "/" route) and other for screen sharing (ScreenTestPage for "/screen-test" route) using different components and js files
6. Then run the command "npm run dev" to start the app and follow th link given in the terminal

**SCREEN SHARING FLOW**

1. First of all the landing page will be opened then there will be a button on the screen "start screen share", on clicking that button you will be rendered on the screen test page route.
2. On the Screen Test paage there will be a button of "Request Screen share", on clicking that button there will open a dialog box for permission access type of screen sharing with options ("Allow this time", "Allow while visiting this site") and Don't allow option
3. After chhosing one of the two options for allowing there will be open a screen picker to choose the content anybody want to share
4. On selecting any one of the tab screen sharing will start in a minimized version also you will see a meta data of the screen sharing and, options of full screen and stop sharing 
5. Now you can share the screen, and this will only support Edge and Chrome with mobile safe layout (but unsupported in mobile)
6. After stopping screen sharing you will see two buttons "Retry screen test" to retry the test and "back to home" to return home
7. If at the time of screen sharing you choose the third option that is don't allow then there will be shown "Permission Denied" and two buttons also "Try again", "Back to home"

   
