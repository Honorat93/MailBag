"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const imapflow_1 = require("imapflow");
const mailparser_1 = require("mailparser");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
class Worker {
    constructor(inServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    connectToServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new imapflow_1.ImapFlow({
                host: Worker.serverInfo.imap.host,
                port: Worker.serverInfo.imap.port,
                auth: {
                    user: Worker.serverInfo.imap.auth.user,
                    pass: Worker.serverInfo.imap.auth.pass
                }
            });
            client.on("error", (error) => {
                console.log("Imap client Error");
            });
            yield client.connect();
            return client;
        });
    }
    listMailboxes() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.connectToServer();
            const mailboxes = yield client.list();
            yield client.close();
            const finalMailBoxes = mailboxes.map(mailbox => ({
                name: mailbox.name,
                path: mailbox.path
            }));
            return finalMailBoxes;
        });
    }
    listMessages(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d, _e;
            const client = yield this.connectToServer();
            const mailbox = yield client.mailboxOpen(inCallOptions.mailbox);
            if (mailbox.exists === 0) {
                yield client.close();
                return [];
            }
            const finalMessages = [];
            try {
                for (var _f = true, _g = __asyncValues(client.fetch("1:*", { uid: true, envelope: true })), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                    _c = _h.value;
                    _f = false;
                    const msg = _c;
                    finalMessages.push({
                        id: msg.uid.toString(),
                        date: msg.envelope.date,
                        from: ((_e = (_d = msg.envelope.from) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.address) || "",
                        subject: msg.envelope.subject
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield client.close();
            return finalMessages;
        });
    }
    getMessageBody(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            const client = yield this.connectToServer();
            yield client.mailboxOpen(inCallOptions.mailbox);
            const messages = yield client.fetch(`${inCallOptions.id}`, { source: true });
            let rawMessage = "";
            try {
                for (var _d = true, messages_1 = __asyncValues(messages), messages_1_1; messages_1_1 = yield messages_1.next(), _a = messages_1_1.done, !_a; _d = true) {
                    _c = messages_1_1.value;
                    _d = false;
                    const message = _c;
                    rawMessage = message.source.toString();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = messages_1.return)) yield _b.call(messages_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            const parsed = yield (0, mailparser_1.simpleParser)(rawMessage);
            yield client.close();
            return parsed.text || parsed.html || undefined;
        });
    }
    deleteMessage(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.connectToServer();
            yield client.messageDelete(`${inCallOptions.id}`, { uid: true });
            yield client.close();
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=IMAP.js.map