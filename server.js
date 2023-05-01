const express = require("express");
const cors = require("cors");
const app = express();
const { expressjwt: expressJwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");

app.use(cors());

const BASE_URL = process.env.BASE_URL

const authy = async (req, res , next)=>{
    expressJwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${BASE_URL}.well-known/jwks.json`,
      }),
      audience: "internassignapi",
      issuer: BASE_URL,
      algorithms: ["RS256"],
    })

    next();
}


//Here we are Protecting api end point using authenticated requests!
app.get("/private", authy , async (req, res) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const response = await axios.get('https://ritik2884.us.auth0.com/userinfo' , {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    res.send("Hi " + response.data.name)
  }
  catch (e){
    // console.log("Inside private catch")
    res.send("<h2>Protected Api end point! Details cannot be accessed by you directly!</h2>")
  }
});

app.get("/", (req, res) => {
  res.send("hii this is index speaking");
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
