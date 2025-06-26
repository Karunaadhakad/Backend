import express, { request, response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { candidateRegistrationController,candidateVerifyEmailController,candidateLoginController,candidateLogoutController ,myStatusController} from '../controller/candidateController.js';
import { candidateVacancyListController } from '../controller/vacancyController.js';

var candidateRouter = express.Router();

candidateRouter.use(express.static('public'));
const candidate_secret_key = process.env.CANDIDATE_SECRET_KEY;
const authenticateJWT = (request,response,next)=>{
    try{
        //    const token = request.cookies.candidate_jwt_token;
            const token = request.query.candidateToken;
           jwt.verify(token,candidate_secret_key,(error,payload)=>{
            if(error){
                console.log("Error--------:",error);
                // response.render("candidateLogin",{message:"Please Login First"});
                 response.status(203).send({message:"Please Login First"});

            }else{
                request.payload=payload;
                next();
            }
           })

    }
    catch(error){
        console.log("Error:",error);
        
        // response.render("candidateLogin",{message:"Something went wrong in JWT"});
        response.status(500).send({message:"Something went wrong in JWT"});
        
    }
}
candidateRouter.get("/candidateLogin",(request,response)=>{
    response.render("candidateLogin",{message:""});
});
candidateRouter.get("/candidateRegistration",(request,response)=>{
    response.render("candidateRegistration",{message:""});
});
candidateRouter.get("/candidateHome",authenticateJWT,(request,response)=>{
    response.render("candidateHome",{email:request.payload.email});
});
candidateRouter.post("/candidateRegistration",candidateRegistrationController );
candidateRouter.get("/verifyEmail",candidateVerifyEmailController);
candidateRouter.post("/candidateLogin",candidateLoginController);
candidateRouter.get("/candidateLogout",candidateLogoutController);
candidateRouter.get("/vacancyList",authenticateJWT, candidateVacancyListController);
candidateRouter.get("/myStatus",authenticateJWT,myStatusController);
export default candidateRouter;