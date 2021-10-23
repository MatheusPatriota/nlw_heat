import express, { response } from "express";
import "dotenv/config";
import { router } from "./Routes";

const app = express();
app.use(express.json())

app.use(router);

app.get("/github", (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
  console.log(process.env.GITHUB_CLIENT_ID);
});

app.get("/signin/callback", (request, response) =>{
  const {code} = request.query;

  return response.json(code);
})

app.listen(4000, () => {
  console.log("🚀 server is running on port 4000");
});
