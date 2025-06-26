import express, { request, response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import {recruiterRegistrationController,recruiterVerifyEmailController,recruiterLoginController,recruiterLogoutController,appliedCandidateListController,recruiterUpdateStatusController} from '../controller/recruiterController.js';
import recruiterSchema from '../model/recruiterSchema.js';
import { recruiterVacancyPostedController } from '../controller/vacancyController.js';
var recruiterRouter = express.Router();

recruiterRouter.use(express.static('public'));
const recruiter_secret_key = process.env.RECRUITER_SECRET_KEY;
const authenticateJWT = (request,response,next)=>{
    try{
           const token = request.query.recruiterToken;
           jwt.verify(token,recruiter_secret_key,(error,payload)=>{
            if(error){
                // response.render("recruiterLogin",{message:"Please Login First"});
                response.status(203).send({message:"Please Login First"});

            }else{
                request.payload=payload;
                next();
            }
           })

    }
    catch(error){
        response.status(500).send({message:"Something went wrong in JWT"});
        
    }
}

recruiterRouter.post("/recruiterRegistration",recruiterRegistrationController );
recruiterRouter.get("/verifyEmail",recruiterVerifyEmailController);
recruiterRouter.post("/recruiterLogin",recruiterLoginController);
recruiterRouter.get("/recruiterLogout",recruiterLogoutController);

recruiterRouter.get("/recruiterHome",authenticateJWT,(request,response)=>{
    response.render("recruiterHome",{email:request.payload.email});
});
recruiterRouter.get("/addVacancy",authenticateJWT,async(request,response)=>{
   const recruiterObj = await recruiterSchema.findOne({email:request.payload.email});
   response.render("addVacancy",{email:request.payload.email,recruiterObj:recruiterObj,message:""});
});
recruiterRouter.get("/vacancyPosted",authenticateJWT, recruiterVacancyPostedController);
recruiterRouter.get("/appliedCandidateList",authenticateJWT,appliedCandidateListController);
recruiterRouter.post("/recruiterUpdateStatus",authenticateJWT,recruiterUpdateStatusController);
export default recruiterRouter;