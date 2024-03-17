// DIFFERENT WAYS TO CONNECT TO DATABASE
// 1. Saara code index file mei rakh du
// 2. Make a seperate folder for database and create a function to connect to database and import here

// dotenv package for using the environment variables in our app.
import "dotenv/config";

// importing the function which will help us to connect to database.
import connectToDB from "./db/index.js";

// importing the express app
import app from "./app.js";



// Executing the function to connect to the database and start the server based on that
connectToDB()
  .then(() => {
    // We have various event listeners on which app can listen
    // -> error : if there is some sort of error while creating the app it is executed
    app.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT : ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });


/*
// IIFE WAY TO CONNECT TO DATABASE
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_ATLAS_URI}/${DB_NAME}`)
    } catch (error) {
        console.error(`Error while connecting to database : ${error.message}`);
        throw error
    }
})();
*/
