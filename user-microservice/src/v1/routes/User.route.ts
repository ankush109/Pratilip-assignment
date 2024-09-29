import express, { type Router } from "express";
import { ProfileController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { publishMessage } from "../../app";


const router: Router = express.Router();

router.post("/profile",authMiddleware,ProfileController.createMyprofile);
router.get("/get-profile", authMiddleware,ProfileController.getMyProfile);

router.get('/send/:msg', async (req, res) => {
    const msg = req.params.msg;
    await publishMessage(msg);
    res.send(`Message sent: ${msg}`);
});


export default router;
