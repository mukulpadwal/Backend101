const asyncHandler = (requestHandler) => {
  // requestHandler is a async function with params (req, res)
  // We need to execute the function
  // returning a callback function
  return (req, res, next) => {
    new Promise((resolve, reject) => {
      if (requestHandler) {
        resolve(requestHandler(req, res, next));
      } else {
        reject("Controller Function Missing...");
      }
    })
      .then(() => next())
      .catch((error) => console.log(error));
  };
};

export default asyncHandler;

/*
BREAK DOWN OF FUNCTION FOR BETTER UNDERSTANDING

-> const functionName = () => {}
-> const functionName = (fun) => {}
-> const functionName = (fun) => {async () => {}}
*/

// Higher order function
// functions that can return and accept functions as parameters

// With try catch block
// const asyncHandler = (fun) => {
//   return async (req, res, next) => {
//     try {
//         await fun(req, res, next);
//     } catch (error) {
//       res
//         .status(error.code || 500)
//         .json({ success: false, message: error.message });
//     }
//   };
// };
