import express, { request, response } from 'express';
import {adminLogoutController,adminLoginController,adminRecruiterListController,adminVerifyRecruiterController,adminCandidateListController,adminVerifyCandidateController} from '../controller/adminController.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const admin_secret_key = process.env.ADMIN_SECRET_KEY;
var adminRouter = express.Router();

adminRouter.use(express.static('public'));

const authenticateJWT = (request,response,next)=>{
    try{
        //    const token = request.cookies.admin_jwt_token;
           const token = request.query.adminToken;
           jwt.verify(token,admin_secret_key,(error,payload)=>{
            if(error){
                // response.render("adminLogin",{message:"Please Login First"});
                response.status(203).send({message:"Please Login First"});


            }else{
                request.payload=payload;
                next();
            }
           })

    }
    catch(error){
        // response.render("adminLogin",{message:"Something went wrong in JWT"});
        response.status(500).send({message:"Something went wrong in JWT"});
        
    }
}


adminRouter.post("/adminLogin",adminLoginController);
adminRouter.get("/adminLogout",adminLogoutController);
adminRouter.get("/adminRecruiterList",authenticateJWT,adminRecruiterListController);
adminRouter.get("/adminVerifyRecruiter",authenticateJWT,adminVerifyRecruiterController);
adminRouter.get("/adminCandidateList",authenticateJWT,adminCandidateListController);
adminRouter.get("/adminVerifyCandidate",authenticateJWT,adminVerifyCandidateController);
export default adminRouter;