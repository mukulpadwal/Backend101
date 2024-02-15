require("dotenv").config();
const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/twitter", (req, res) => {
  res.send("@padwalmukul");
});

app.get("/login", (req, res) => {
  res.send("<h1>Please login at chai aur code!!!</h1>");
});

app.get("/linkedin", (req, res) => {
  res.send(
    "<a href='https://www.linkedin.com/in/mukulpadwal'>Mukul Padwal</a>"
  );
});

app.get("/github/mukulpadwal", (req, res) => {
  res.json({
    login: "mukulpadwal",
    id: 80583870,
    node_id: "MDQ6VXNlcjgwNTgzODcw",
    avatar_url: "https://avatars.githubusercontent.com/u/80583870?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/mukulpadwal",
    html_url: "https://github.com/mukulpadwal",
    followers_url: "https://api.github.com/users/mukulpadwal/followers",
    following_url:
      "https://api.github.com/users/mukulpadwal/following{/other_user}",
    gists_url: "https://api.github.com/users/mukulpadwal/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/mukulpadwal/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/mukulpadwal/subscriptions",
    organizations_url: "https://api.github.com/users/mukulpadwal/orgs",
    repos_url: "https://api.github.com/users/mukulpadwal/repos",
    events_url: "https://api.github.com/users/mukulpadwal/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/mukulpadwal/received_events",
    type: "User",
    site_admin: false,
    name: "Mukul Padwal",
    company: null,
    blog: "https://mukulpadwal.tech",
    location: "Dalhousie",
    email: null,
    hireable: true,
    bio: null,
    twitter_username: "padwalmukul",
    public_repos: 29,
    public_gists: 0,
    followers: 41,
    following: 24,
    created_at: "2021-03-13T12:59:33Z",
    updated_at: "2024-02-12T13:05:40Z",
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
