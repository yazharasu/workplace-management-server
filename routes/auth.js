const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const Company = require('../models/Company');
const OtpVerification = require('../models/OtpVerification');
dotenv.config();

// node mailer setup
let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    auth: {
        user:  process.env.authEmail,
        pass:  process.env.authPass
    }
})

// Register a Company
router.post( '/register', async (req, res) => {
    try{
        // Hashing password
        const salt = await bcrypt.genSalt(2);
        const hashedPassword = await bcrypt.hash( req.body.password, salt );
        const newCompany = await new Company( {
            companyName : req.body.company,
            location: req.body.location,
            noEmp: req.body.noEmp,
            employees: { 
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword,
                email: req.body.email,
                isAdmin: true
            }
        })
        await newCompany.save()
            .then( () => {
                otpEmail( {email:req.body.email}, res)
            })
    }
    catch (err){
        console.log(err)
    }
} );

// verify otp
router.put( '/verifyOTP', async (req, res) => {
    try{
        let { email, otp } = req.body;

        if( !otp || !email) {
            throw Error("Empty OTP details are not allowed");
        }else {
            const otpVerificationRecords = await OtpVerification.find( { email: email });
            if( otpVerificationRecords.length <= 0) {
                // no otp record found
                throw new Error("Account record didnt exist or has been verified already. Please signup or signin")
            } else {
            // record exist
            const { expiresAt } = otpVerificationRecords[0];
            const hashedOTP = otpVerificationRecords[0].otp;

            if ( expiresAt < Date.now() ) {
                //OTP expired
                await OtpVerification.deleteMany( { email });
                throw new Error("Code has been expired. Please request new one")
            } else {
                const validOTP = await bcrypt.compare(otp, hashedOTP);
                if(validOTP) {
                    //success
                    const company = await Company.findOne( { "employees.email": email } )
                    await company.updateOne( { isVerified: true })
                    await OtpVerification.deleteMany( { email });
                    res.json({
                        status: "VERIFIED",
                        message: "Email is successfully verified"
                    })
                } else {
                    res.json({
                        status: "INVALID",
                        message: "Invalid code. Try again."
                    })
                }
            }
            }
        }
    }
    catch (err) {
        res.json({
            status: "FAILED",
            message: err.message
        })
    }
} )

// Login
router.patch( '/login', async (req, res) => {
    try{
        let user = await Company.aggregate([
            {
              $match: {
                "employees.email": req.body.email,
              },
            },
            {
              $project: {
                employees: {
                  $filter: {
                    input: "$employees",
                    as: "employee",
                    cond: {
                      $in: ["$$employee.email", [req.body.email]],
                    },
                  },
                },
              },
            },
          ])
        const validOTP = await bcrypt.compare( req.body.password, user[0].employees[0].password );
        console.log( user[0].employees[0].password )
        if (validOTP) {
            await Company.findOneAndUpdate( { "employees.email": req.body.email  },  { $set: { "employees.$.loggedIn": true } }  )
            let userData = { email: user[0].employees[0].email, 
                firstName: user[0].employees[0].firstName,
                isAdmin: user[0].employees[0].isAdmin,
                loggedIn: user[0].employees[0].loggedIn,
                isVerified: user[0].isVerified
                }
            res.json(userData)
        } else{
            res.json("wrong username or password")
        }
    }
    catch (err) {
        res.json(err.message)
        console.log('Something went wrong.');
    }
} )

// Logout
router.patch( '/logout', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email  },  { $set: { "employees.$.loggedIn": true } }  )
        res.json('Logged out successfully')
    }
    catch (err) {
        res.json('Something went wrong.')
        console.log(err.message);
    }
} )

// Check user email
router.get( '/checkEmail', async (req, res) => {
    try{
        const user = await Company.findOne( { "employees.email": req.body.email } )
        if( user[0].employees ) {
            res.json('Already available')
        } else {
            res.json('Not available')
        }
    }
    catch (err) {
        res.json('Something went wrong.')
        console.log(err.message);
    }
} )

//Resend OTP
router.post( '/resendOtp', async (req, res) => {
    try{
        otpEmail( {email: req.body.email}, res)
    }
    catch (err) {
        res.json('Something went wrong.')
    }
} )

// sending OTP verification email
const otpEmail = async ( { email }, res ) => {
    try{
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        //mail options
        const mailOptions = {
            from:  process.env.authEmail,
            to: email,
            subject: 'verify your email',
            html: `<p>One Time password to verify your email is <b>${otp}</b>. 
                <p>OTP <b>expires in one hour</b></p>`
        };

        //hasing the otp
        const salt = await bcrypt.genSalt(3);
        const hashedOTP = await bcrypt.hash( otp, salt );
        const newOtpVerification = await new OtpVerification({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now()+3600000
        });

        //saving otp record
        await newOtpVerification.save();
        await transporter.sendMail(mailOptions)
            res.json({
                status: "PENDING",
                message: "Verification otp email sent",
                data: {
                    email
                }
            })

    }catch (err) {
        res.json({
            status: "FAILED",
            message: err.message,
        })
    }
}

//send first time password to newly added employee
const firstPassEmail = async ( newEmployee, firstTimePass, res ) => {
    try{
        //mail options
        const mailOptions = {
            from:  process.env.authEmail,
            to: newEmployee.email,
            subject: 'Welcome to SA-INTRANET.',
            html: `<p>Use the following credentials to login to SA-INTRANET.
                <p>Userame: <b>${newEmployee.email}</b></p>
                <p>Password: <b>${firstTimePass}</b></p>`
        };

        //sending email
        await transporter.sendMail(mailOptions)
            res.json({
                status: "PENDING",
                message: "Welcome email sent",
            })

    }catch (err) {
        res.json({
            status: "FAILED",
            message: err.message,
        })
    }
}

// Add employees
router.post( '/addEmployees', async (req, res) => {
    try{
        const firstTimePass = Math.random().toString(36).slice(2);
        const salt = await bcrypt.genSalt(3);
        const hashed = await bcrypt.hash( firstTimePass, salt );
        const newEmployee = { 
            "email": req.body.email,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "dept": req.body.dept,
            "designation": req.body.designation,
            "isAdmin": req.body.isAdmin,
            "password": hashed,
            "loggedIn": false
        }

        await Company.findOneAndUpdate( { "employees.email": req.body.email }, 
            { "$push": { "employees": { newEmployee } } }
        )
        .then( () => {
            res.json({
                status: "SUCCESS",
                message: "New employee is added successfully"
            });
            firstPassEmail(newEmployee, firstTimePass);
        })
    }
    catch (err) {
        res.json('Something went wrong.')
        console.log(error);
    }
} )



module.exports = router;
