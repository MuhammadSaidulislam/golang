import React, { useState, useEffect } from 'react';
import "./Login.css";
import logo from "../../Assets/Images/logo/logo.svg";
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { loginAdmin, memberPassword } from '../../api/admin';
import { showNotifications, TOAST_TYPE } from '../../CommonFunction/toaster';
import { authenticate } from '../../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { DESKIE_API as API } from '../../config';

const Login = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>();
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    const [userEmail, setUserEmail] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm();

    const showPass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("password")
    }

    const hidePass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("")
    }

    let onSubmit = (user: any) => {
        const { email, password } = user;
        loginAdmin({ email, password }).then((data) => {
            if (data.statusCode !== 200) {
                showNotifications(TOAST_TYPE.error, 'Login Unsuccessful', 'Incorrect email or password');
            }
            else {
                if (data.passwordCheck === true) {
                    setPasswordUpdate(true);
                    setUserEmail(email);
                }
                else {
                    showNotifications(TOAST_TYPE.success, 'Login Successful', `Welcome back, ${data.user?.name}`);
                    authenticate(data, () => {
                        setTimeout(() => {
                            setValue("email", "", { shouldValidate: false });
                            setValue("password", "", { shouldValidate: false });
                            if (data.user.role === "admin") {
                                return navigate("/admin-list");
                            }
                        }, 500)
                    })
                }
            }
        })
    }




    const LoginForm = () => {
        return (
            <div className="loginBox">
                <div className="logo">
                    {profile && profile.company_logo_dark ?
                        <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
                        : <img src={logo} alt="logo" />
                    }
                </div>
                <div className="loginForm">
                    <h6>Login</h6>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="loginInput">
                            <label htmlFor="email">Email Address</label>
                            <input type='email' {...register("email", { required: true })} placeholder='Email' className='form-control' />
                        </div>
                        <div className="loginInput">
                            <label htmlFor="password">Password</label>
                            <input type={toggleType} {...register("password", { required: true })} placeholder='Password' />
                            {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                        </div>
                        <div className='loginPass'>
                            <label className="agreement">
                                <label className="tableCheckBox">
                                    <div className="contactCheck">
                                        <input type="checkbox" name="agreement" />
                                        <span className="checkmark"></span></div>
                                </label>
                                <span>Remember Me</span>
                            </label>
                            <Link to="/forget-password">Forgot Password?</Link>
                        </div>
                        <div className="loginBtn">
                            <button type='submit'>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };


    return (
        <div>
            <div>
                <section className="loginSection" style={{ background: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(31, 41, 55, 0.94)), url(${profile && `${API}/${encodeURIComponent(profile.background)}`})` }}>
                    {LoginForm()}
                </section>
            </div>
        </div>
    )
}

export default Login