"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/signin", auth_controller_1.signin);
router.post("/initiate-admin-user", auth_controller_1.initiateAdmin);
exports.default = router;
