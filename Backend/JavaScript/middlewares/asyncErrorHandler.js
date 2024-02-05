import { ErrorMsg } from "../utils/customLog.js";

const asyncErrorHandler = (errorFunction) => {
    return (req, res, next) => {
        try {
            errorFunction(req, res, next);
        } catch (error) {
           ErrorMsg(error.message);
            next(error);
        }
    };
};

export default asyncErrorHandler;
