"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/", (req, res) => {
    console.log("first");
    let dayn = 10;
    dayn = 20;
    res.send("Hello World!" + dayn);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
