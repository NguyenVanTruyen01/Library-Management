import express from "express"
import { StatisticalCtr } from "../controller/Statistical/StatisticalController";
const Statistical = express.Router()


Statistical.route('/statistical/')
    .get(StatisticalCtr.getStatistical)

export default Statistical