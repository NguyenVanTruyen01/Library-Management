import { Response, Request, NextFunction } from "express"
import RulesModels from "../../model/Rules/Rules";
const { ObjectId } = require('mongodb');

export const RulesCtrl = {

    getAllRules: async (req: Request, res: Response) => {
        try {
            const listRules = await RulesModels.find().lean();

            return res.status(200).json({
                msg: "Find all rules success !!",
                data: listRules
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    createRule: async (req: Request, res: Response) => {
        try {
            const newRule = req.body;

            const data = await RulesModels.create(newRule);

            return res.status(200).json({
                msg: "create new rule successfully",
                data
            })

        } catch (err) {
            // Server bị lỗi hoặc tiêu đề nội quy đã tồn tại
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    getRuleById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const data = await RulesModels.findById(id);

            //Không tìm thấy thể loại sách theo id
            if (!data) {
                return res.status(404).json({
                    msg: `can't find rule with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "get a rule successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }

    },

    deleteRule: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;

            const data = await RulesModels.findByIdAndDelete(id);

            // Không tìm thấy nội quy để xóa
            if (!data) {
                return res.status(404).json({
                    msg: `can't delete rule with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "delete rule successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    updateRule: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;
            const updateRule = req.body;

            const data = await RulesModels.findByIdAndUpdate(id, updateRule, { new: true });

            if (!data) {
                return res.status(404).json({
                    msg: `can't update rule with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "update rule successfully",
                data

            })

        }
        catch (err) {
            // Server bị lỗi hoặc tiêu đề nội quy đã tồn tại
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    }

}














