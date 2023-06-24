import express from 'express'
import { CallCardCtrl } from '../controller/CallCard/CallCardController';

const CallCardRouters = express.Router()

CallCardRouters.route('/callcard/')
    .get(CallCardCtrl.getAllCallCards)
    .post(CallCardCtrl.borrowBooks);


CallCardRouters.route('/callcard/accept/:id')
    .put(CallCardCtrl.acceptCallCard)

CallCardRouters.route('/callcard/:id')
    .get(CallCardCtrl.getCallCardById)
    .put(CallCardCtrl.returnBooks)
    .delete(CallCardCtrl.deleteCallCard)

CallCardRouters.route('/callcard/:id/user')
    .get(CallCardCtrl.getCallCardByUserId)



export default CallCardRouters

