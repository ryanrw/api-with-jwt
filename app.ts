import {Response, Request, NextFunction} from "express-serve-static-core";
import express from "express";
import * as bodyparser from "body-parser";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import {
    ExtractJwt,
    Strategy,
    StrategyOptions,
    VerifiedCallback
} from "passport-jwt";

const app = express();
const secretKey = "howCanThisBeASecretLOL";

app.use(bodyparser.json());

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};

interface Payload {
    username: string;
}

const jwtAuth = new Strategy(
    options,
    (payload: Payload, done: VerifiedCallback) => {
        if (payload.username === "ryan") {
            return done(null, payload.username);
        } else {
            return done(null, false);
        }
    }
);

passport.use(jwtAuth);

const userCheckMiddleware = passport.authenticate("jwt", {session: false});

const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.body.username === "ryan" && req.body.password === "1234"
        ? next()
        : res.status(401).json({detail: "wrong username or password"});
};

app.get("/", (req: Request, res: Response) => {
    res.json({detail: "welcome!"});
});

app.post("/login", loginMiddleware, (req: Request, res: Response) => {
    const payload: Payload = {
        username: "ryan"
    };
    const token = jwt.sign(payload, secretKey);
    res.json({detail: "login success", token});
});

app.get("/secret", userCheckMiddleware, (req: Request, res: Response) => {
    res.json({detail: "secret zone"});
});

export default app;
