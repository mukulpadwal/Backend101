// DIFFERENT WAYS TO CONNECT TO DATABASE
// 1. Saara code index file mei rakh du
// 2. Make a seperate folder for database and create a function to connect to database and import here
import "dotenv/config";
import connectToDB from "./db/index.js";
import app from "./app.js";

connectToDB()
  .then(() => {
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
ALWAYS REMEMBER
    -> ALWAYS WRAP LOGIC IN try/catch OR promises 
    -> DB IS ALWAYS ON OTHER CONTINENT SO USE async/await AS IT TAKES TIME TO TALK TO DB
*/

/*
// Connect to database : WAY 1
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_ATLAS_URI}/${DB_NAME}`)
    } catch (error) {
        console.error(`Error while connecting to database : ${error.message}`);
        throw error
    }
})();
*/
