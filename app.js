"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyparser = __importStar(require("body-parser"));
var jwt = __importStar(require("jsonwebtoken"));
var passport_1 = __importDefault(require("passport"));
var passport_jwt_1 = require("passport-jwt");
var app = express_1.default();
var secretKey = "howCanThisBeASecretLOL";
app.use(bodyparser.json());
var options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};
var jwtAuth = new passport_jwt_1.Strategy(options, function (payload, done) {
    if (payload.username === "ryan") {
        return done(null, payload.username);
    }
    else {
        return done(null, false);
    }
});
passport_1.default.use(jwtAuth);
var userCheckMiddleware = passport_1.default.authenticate("jwt", { session: false });
var loginMiddleware = function (req, res, next) {
    req.body.username === "ryan" && req.body.password === "1234"
        ? next()
        : res.status(401).json({ detail: "wrong username or password" });
};
app.get("/", function (req, res) {
    res.json({ detail: "welcome!" });
});
app.post("/login", loginMiddleware, function (req, res) {
    var payload = {
        username: "ryan"
    };
    var token = jwt.sign(payload, secretKey);
    res.json({ detail: "login success", token: token });
});
app.get("/secret", userCheckMiddleware, function (req, res) {
    res.json({ detail: "secret zone" });
});
exports.default = app;
