# Secret Santa Web App

The web app will collate participants names and email addresses up until a date and time chosen by the host. Once the time has passed, the programme will generate the matches and send emails.

# Running the App

First add a `.env` file to the root of the project and set a variable to point to the MongoDB resource.

```
DB=mongodb+srv://...
```

Now run `npm install` and `nodemon app.js` to run.
