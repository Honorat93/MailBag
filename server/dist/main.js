"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMTP"));
const ServerInfo_1 = require("./ServerInfo");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "/../../client/dist")));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/mailboxes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const mailboxes = yield imapWorker.listMailboxes();
        res.json(mailboxes);
    }
    catch (error) {
        res.send("Error");
    }
}));
app.get("/mailboxes/:mailbox", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messages = yield imapWorker.listMessages({ mailbox: req.params.mailbox });
        res.json(messages);
    }
    catch (error) {
        res.send("Error");
    }
}));
app.get("/messages/:mailbox/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messageBody = yield imapWorker.getMessageBody({ mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10)
        });
        res.send(messageBody);
    }
    catch (error) {
        res.send("Error");
    }
}));
app.delete("/messages/:mailbox/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10)
        });
        res.send("ok");
    }
    catch (error) {
        res.send("Error");
    }
}));
app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
        yield smtpWorker.sendMessage(req.body);
        res.send("ok");
    }
    catch (error) {
        res.send("Error");
    }
}));
//# sourceMappingURL=main.js.map