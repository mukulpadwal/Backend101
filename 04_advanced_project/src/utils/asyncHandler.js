const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    return new Promise.resolve(requestHandler(req, res, next)).reject((error) =>
      next(error)
    );
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
