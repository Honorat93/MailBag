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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const node_1 = require("lowdb/node");
const lib_1 = require("lowdb/lib");
const path = __importStar(require("path"));
class Worker {
    constructor() {
        const filePath = path.join(__dirname, "contacts.json");
        const adapter = new node_1.JSONFile(filePath);
        this.db = new lib_1.Low(adapter, { contacts: [] });
        this.db.read();
    }
    listContacts() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.db.read();
            return ((_a = this.db.data) === null || _a === void 0 ? void 0 : _a.contacts) || [];
        });
    }
    addContact(inContact) {
        return new Promise((resolve, reject) => {
            if (this.db.data && this.db.data.contacts) {
                inContact.id = this.db.data.contacts.length + 1;
                this.db.data.contacts.push(inContact);
                this.db.write()
                    .then(() => {
                    resolve(inContact);
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            else {
                reject(new Error("Données invalides"));
            }
        });
    }
    deleteContact(inID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.db.read();
            const contacts = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.contacts;
            if (!contacts) {
                throw new Error("Données invalides");
            }
            const contactIndex = contacts.findIndex(contact => String(contact.id) === inID);
            if (contactIndex === -1) {
                throw new Error(`Contact avec l'ID "${inID}" introuvable`);
            }
            contacts.splice(contactIndex, 1);
            yield this.db.write();
            return `Contact avec l'ID "${inID}" supprimé`;
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=contacts.js.map