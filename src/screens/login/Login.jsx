import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from "yup";
import { Form, Field, ErrorMessage, Formik } from "formik";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faLock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";

import { signUpUser } from "../../config/firebase/firebaseMethods";
import { loginUser } from '../../config/firebase/firebaseMethods';

import "./login.css";
import Logo from "../../assets/logo.png";
import Loader from '../../components/loader/Loader';
import Alert from '../../components/alert/Alert';


const Login = () => {

    const navigate = useNavigate();

    const [isMember, setIsMember] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfPassword, setIsShowConfPassword] = useState(false);

    const [isBlur, setIsBlur] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(true);
    const [alertMsg, setAlertMsg] = useState("");

    return (
        <>
            <div className={`main-section ${isBlur && "blur-sm"}`}>

                {/* Logo */}
                <div className='logo-header'>
                    <img src={Logo} alt="logo" width={130} />
                </div>


                {/* Logo  */}
                <div className="logo-section">
                    <img src={Logo} alt="logo" width={300} />
                    <p className="hidden lg:block mt-6 text-2xl text-[--text-white]"> Connect and share with the people <br /> in your life with <strong className='text-[--primary-color]'> Klikz Media. </strong> </p>
                </div>


                {/* Login & Register */}
                <div className="form-section">

                    {
                        isMember ?
                            <>
                                {/* Login Form */}
                                <div>
                                    <h1 className='form-heading'> Login </h1>

                                    <Formik

                                        initialValues={{
                                            email: "",
                                            password: "",
                                        }}

                                        validationSchema={Yup.object({
                                            email: Yup.string().email("Invalid Email Address.").required("Email is required."),
                                            password: Yup.string().min(8, "Password must be atleast 8 characters.").required("Password is required")
                                        })}

                                        onSubmit={(values) => {
                                            // console.log(values);
                                            setIsBlur(true)

                                            loginUser({
                                                email: values.email,
                                                password: values.password
                                            })
                                                .then((res) => {
                                                    // console.log(res);
                                                    setIsAlert(true);
                                                    setAlertSuccess(true);
                                                    setAlertMsg("Login Successfully!");

                                                    setTimeout(() => {
                                                        navigate("/")
                                                    }, 1500);
                                                })
                                                .catch((err) => {
                                                    setIsAlert(true);
                                                    setAlertMsg(err.message)
                                                    setAlertSuccess(false);

                                                    setTimeout(() => {
                                                        setIsAlert(false);
                                                        setIsBlur(false)
                                                    }, 2500);

                                                    console.log(err);
                                                })

                                        }}
                                    >

                                        <Form className="space-y-6">

                                            {/* Email */}
                                            <div>
                                                {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900"> Email </label> */}
                                                <div className="relative">
                                                    <div className="input-icon-wrapper">
                                                        <span className='icon'> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                                    </div>
                                                    <Field name="email" type="email" className="input" placeholder="Email Address" />
                                                </div>
                                                <ErrorMessage name="email" component="span" className='error' />
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <div className="relative">

                                                    {/* Password Input */}
                                                    <div>
                                                        <div className="input-icon-wrapper">
                                                            <span className='icon'> <FontAwesomeIcon icon={faLock} /> </span>
                                                        </div>
                                                        <Field type={isShowPassword ? "text" : "password"} name="password" className="input" placeholder="Password" />
                                                    </div>

                                                    {/* Show & Hide Password */}
                                                    <div className="display-password">
                                                        <span onClick={() => setIsShowPassword(!isShowPassword)} className='text-sm text-blue-500 cursor-pointer'>
                                                            {isShowPassword ? "Hide" : "Show"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ErrorMessage name="password" component="span" className='error' />
                                            </div>

                                            <div>
                                                <button type="submit" className='submit-btn' disabled={isBlur && true} > Login </button>
                                            </div>
                                        </Form>

                                    </Formik>
                                </div>

                                {/* Signup Short Link */}
                                <div className="short-link">
                                    <span> Don't have an account? <button onClick={() => setIsMember(false)} className='text-[--secondary-color]'> Signup </button> </span>
                                </div>
                            </>
                            :
                            <>
                                {/* Signup Form */}
                                <div>
                                    <h1 className='form-heading'> Signup </h1>

                                    <Formik
                                        initialValues={{
                                            userName: "",
                                            SignupEmail: "",
                                            password: "",
                                            confirmPassword: ""
                                        }}

                                        validationSchema={Yup.object({
                                            userName: Yup.string().min(4, "Name must be atleast 4 characters.").required("Name is required"),
                                            SignupEmail: Yup.string().email("Invalid Email Address.").required("Email is required."),
                                            password: Yup.string().min(8, "Password must be atleast 8 characters.").required("Password is required"),
                                            confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Password should be same.").required("Confirm Password is required")
                                        })}

                                        onSubmit={(values) => {
                                            // console.log(values);
                                            setIsBlur(true)

                                            let userObj = {
                                                userName: values.userName,
                                                email: values.SignupEmail,
                                                contact: null,
                                                profileImg: null,
                                                followers: [],
                                                following: [],
                                                likedPosts: [],
                                                password: values.password
                                            }

                                            signUpUser(userObj)
                                                .then((res) => {
                                                    // console.log("SignUp Successfully! --- ", res);

                                                    setIsAlert(true);
                                                    setAlertSuccess(true);
                                                    setAlertMsg("Signup Successfully!");

                                                    setTimeout(() => {
                                                        navigate("/")
                                                    }, 1500);
                                                })
                                                .catch((err) => {
                                                    setIsAlert(true);
                                                    setAlertMsg(err)
                                                    setAlertSuccess(false);

                                                    setTimeout(() => {
                                                        setIsAlert(false);
                                                        setIsBlur(false)
                                                    }, 2500);
                                                    console.log(err);
                                                })
                                        }}
                                    >
                                        <Form className="space-y-4">

                                            {/* User Name */}
                                            <div>
                                                <div className="relative">
                                                    <div className="input-icon-wrapper">
                                                        <span className='icon'> <FontAwesomeIcon icon={faUser} /> </span>
                                                    </div>
                                                    <Field type="text" name="userName" className="input" placeholder="Name" />
                                                </div>
                                                <ErrorMessage name="userName" component="span" className='error' />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <div className="relative">
                                                    <div className="input-icon-wrapper">
                                                        <span className='icon'> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                                    </div>
                                                    <Field type="email" name="SignupEmail" className="input" placeholder="Email Address" />
                                                </div>
                                                <ErrorMessage name="SignupEmail" component="span" className='error' />
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <div className="relative">

                                                    {/* Password Input */}
                                                    <div>
                                                        <div className="input-icon-wrapper">
                                                            <span className='icon'> <FontAwesomeIcon icon={faLock} /> </span>
                                                        </div>
                                                        <Field type={isShowPassword ? "text" : "password"} name="password" className="input" placeholder="Password" />
                                                    </div>

                                                    {/* Show & Hide Password */}
                                                    <div className="display-password">
                                                        <span onClick={() => setIsShowPassword(!isShowPassword)} className='text-sm text-[--secondary-color] cursor-pointer'>
                                                            {isShowPassword ? "Hide" : "Show"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ErrorMessage name="password" component="span" className='error' />
                                            </div>

                                            {/* Confirm Password */}
                                            <div>
                                                <div className="relative">

                                                    {/* Password Input */}
                                                    <div>
                                                        <div className="input-icon-wrapper">
                                                            <span className='icon'> <FontAwesomeIcon icon={faUnlockKeyhole} /> </span>
                                                        </div>
                                                        <Field type={isShowConfPassword ? "text" : "password"} name="confirmPassword" className="input" placeholder="Confirm Password" />
                                                    </div>

                                                    {/* Show & Hide Password */}
                                                    <div className="display-password">
                                                        <span onClick={() => setIsShowConfPassword(!isShowConfPassword)} className='text-sm text-blue-500 cursor-pointer'>
                                                            {isShowConfPassword ? "Hide" : "Show"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ErrorMessage name="confirmPassword" component="span" className='error' />
                                            </div>

                                            <div>
                                                <button type="submit" className='submit-btn' disabled={isBlur && true}> Signup </button>
                                            </div>

                                        </Form>
                                    </Formik >

                                </div>

                                {/* Login Short Link */}
                                <div className="short-link">
                                    <span> Already a member? <button onClick={() => setIsMember(true)} className='text-[--secondary-color]'> Login </button> </span>
                                </div>
                            </>
                    }
                </div>

            </div >


            {isBlur && <Loader />}
            <Alert isAlert={isAlert} alertSuccess={alertSuccess} alertMsg={alertMsg} />

        </>
    )
}

export default Login