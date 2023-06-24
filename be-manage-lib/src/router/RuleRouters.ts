import express from 'express'
import { RulesCtrl } from '../controller/Rule/RuleController';

const RuleRouters = express.Router()

RuleRouters.route('/rule/')
    .get(RulesCtrl.getAllRules)
    .post(RulesCtrl.createRule);

RuleRouters.route('/rule/:id')
    .get(RulesCtrl.getRuleById)
    .delete(RulesCtrl.deleteRule)
    .put(RulesCtrl.updateRule);

export default RuleRouters

