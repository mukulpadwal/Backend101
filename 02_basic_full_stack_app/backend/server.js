import express from "express";
// SyntaxError: Cannot use import statement outside a module
// in package.json add {"type" : "module"} -> solution for above error

const app = express();

const PORT = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.send("Server Home");
// });

// Get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "Joke 1",
      content:
        "Why don’t scientists trust atoms? Because they make up everything!",
    },
    {
      id: 2,
      title: "Joke 2",
      content:
        "Did you hear about the mathematician who’s afraid of negative numbers? He will stop at nothing to avoid them!",
    },
    {
      id: 3,
      title: "Joke 3",
      content:
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
    },
    {
      id: 4,
      title: "Joke 4",
      content: "How does a penguin build its house? Igloos it together!",
    },
    {
      id: 5,
      title: "Joke 5",
      content: "Why did the bicycle fall over? Because it was two-tired!",
    },
  ];

  res.send(jokes);
});

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
