import { useState } from "react";
import { Form, Field, ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"

import "./form.css"
import { loginUser } from "../../config/firebase/firebaseMethods";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <>

      <h1 className='mb-6 text-center text-3xl font-semibold'> Login </h1>

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

          loginUser({
            email: values.email,
            password: values.password
          })
            .then((res) => {
              console.log(res);
              // navigate("/")
            })
            .catch((err) => {
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
                <span className='text-gray-500'> <FontAwesomeIcon icon={faEnvelope} /> </span>
              </div>
              <Field name="email" type="email" className="input" placeholder="Email Addres" />
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
                <Field type={isShowPassword ? "text" : "password"} name="password" className="input" placeholder="Password" />
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

          <div>
            <button type="submit" className='submit-btn'> Login </button>
          </div>
        </Form>

      </Formik>

    </>
  )
}

export default LoginForm