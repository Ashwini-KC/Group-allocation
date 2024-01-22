const {Router}= require('express')
const { postTopic, getTopics, deleteTopic, updateTopic , getTopicsById, searchTopics} = require('../controllers/topics.controller')
const { supervisorVerify,verifyToken, adminOrSupervisorVerify} = require('../middleware/auth')

const router = Router()

router.post("/", supervisorVerify, postTopic)
router.get("/", getTopics)
router.get('/searchTopics', searchTopics)
router.delete("/:id", adminOrSupervisorVerify, deleteTopic)
router.put("/:id/", adminOrSupervisorVerify,updateTopic)
router.get("/:id", getTopicsById)

module.exports = router