import { useState } from "react";
import * as Yup from "yup";
import { Form, Field, ErrorMessage, Formik } from "formik";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUnlockKeyhole, faUser } from "@fortawesome/free-solid-svg-icons"

import "./form.css"
import { signUpUser } from "../../config/firebase/firebaseMethods";
import { useNavigate } from "react-router-dom";


const SignupForm = () => {

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfPassword, setIsShowConfPassword] = useState(false);

    const navigate = useNavigate();


    return (
        <>
            <h1 className='mb-6 text-center text-3xl font-semibold'> Signup </h1>

            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                }}

                validationSchema={Yup.object({
                    name: Yup.string().min(4, "Name must be atleast 4 characters.").required("Name is required"),
                    email: Yup.string().email("Invalid Email Address.").required("Email is required."),
                    password: Yup.string().min(8, "Password must be atleast 8 characters.").required("Password is required"),
                    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Password should be same.").required("Confirm Password is required")
                })}

                onSubmit={(values) => {
                    // console.log(values);

                    signUpUser({
                        userName: values.name,
                        email: values.email,
                        password: values.password
                    })
                        .then((res) => {
                            console.log("SignUp Successfully! --- ", res);
                            navigate("/");
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }}
            >
                <Form className="space-y-4">

                    {/* User Name */}
                    <div>
                        <div className="relative">
                            <div className="input-icon-wrapper">
                                <span className='text-gray-500'> <FontAwesomeIcon icon={faUser} /> </span>
                            </div>
                            <Field name="name" type="text" className="input" placeholder="Full Name" />
                        </div>
                        <ErrorMessage name="name" component="span" className='mt-1 text-sm text-red-400' />
                    </div>

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <div className="input-icon-wrapper">
                                <span className='text-gray-500'> <FontAwesomeIcon icon={faEnvelope} /> </span>
                            </div>
                            <Field type="email" name="email" className="input" placeholder="Email Address" />
                        </div>
                        <ErrorMessage name="email" component="span" className='mt-1 text-sm text-red-400' />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">

                            {/* Password Input */}
                            <div>
                                <div className="input-icon-wrapper">
                                    <span className='text-gray-500'> <FontAwesomeIcon icon={faLock} /> </span>
                                </div>
                                <Field type={isShowPassword ? "text" : "password"} name="password" className="input" placeholder="password" />
                            </div>

                            {/* Show & Hide Password */}
                            <div className="display-password">
                                <span onClick={() => setIsShowPassword(!isShowPassword)} className='text-sm text-blue-500 cursor-pointer'>
                                    {isShowPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                        </div>
                        <ErrorMessage name="password" component="span" className='mt-1 text-sm text-red-400' />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative">

                            {/* Password Input */}
                            <div>
                                <div className="input-icon-wrapper">
                                    <span className='text-gray-500'> <FontAwesomeIcon icon={faUnlockKeyhole} /> </span>
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
                        <ErrorMessage name="confirmPassword" component="span" className='mt-1 text-sm text-red-400' />
                    </div>

                    <div>
                        <button type="submit" className='submit-btn'> Signup </button>
                    </div>

                </Form>
            </Formik >

        </>
    )
}

export default SignupForm