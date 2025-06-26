import express from 'express';
import adminRouter from './router/adminRouter.js';
import recruiterRouter from './router/recruiterRouter.js';
import candidateRouter from './router/candidateRouter.js';
import vacancyRouter from './router/vacancyRouter.js';
import appliedVacancyRouter from './router/appliedVacancyRouter.js'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

var app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.set("views","views");
app.set("view engine","ejs");



app.get("/",(request,response)=>{
    response.render("home")
});

app.use("/admin",adminRouter);
app.use("/candidate",candidateRouter);
app.use("/recruiter",recruiterRouter);
app.use("/vacancy",vacancyRouter);
app.use("/appliedVacancy",appliedVacancyRouter);

app.listen(3001,()=>{
    console.log("Server connection established");
    
});