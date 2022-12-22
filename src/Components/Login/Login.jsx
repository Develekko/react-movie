import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../../Context/AuthContext';
import {
    LoginSocialGoogle,
    LoginSocialFacebook,
    LoginSocialGithub,
    LoginSocialTwitter
} from 'reactjs-social-login';
import {
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton,
    TwitterLoginButton
} from 'react-social-login-buttons';
export default function Register({ saveUserData }) {
    let { userData, setUserProfile,userProfile } = useContext(AuthContext);
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const [joiErrors, setJoiErrors] = useState([]);
    const [apiMessage, setapiMessage] = useState('');
    const [isLoading, setisLoading] = useState(false)

    function getUSerData(e) {
        let User = { ...user };
        User[e.target.id] = e.target.value;
        setUser(User);
        $(e.target).next().html('')
    }
    async function sendApiData() {
        let { data } = await axios.post('https://sticky-note-fe.vercel.app/signin', user);
        setisLoading(false)
        if (data.message === 'success') {
            localStorage.setItem('userToken', data.token)
            saveUserData()
            navigate('/')
        }
        else {
            setapiMessage(data.message)
        }
    }
    function submitForm(e) {
        e.preventDefault();
        setisLoading(true)
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().required().pattern(/^\w{8,}$/)
        })
        const joiResponse = schema.validate(user, { abortEarly: false })
        if (joiResponse.error) {
            setJoiErrors(joiResponse.error.details)
            setisLoading(false)
        }
        else {
            sendApiData()
        }
    }
    useEffect(() => {
        if (userData !== null || userProfile !== null) {
            navigate('/')
        }
        $('#password').on('input', function () {
            if ($('#password').val() === '') {
                $('.showPass').fadeOut()
            }
            else {
                $('.showPass').fadeIn()
            }
        })
    })
    function showPass() {
        if ($('#password').attr('type') === "text") {
            $('#password').attr('type', 'password');
            $('.showPass').html('<i data-show="show" class="fa-solid fa-eye-slash"></i>');
        } else {
            $('#password').attr('type', 'text');
            $('.showPass').html('<i data-show="show" class="fa-solid fa-eye"></i>');
        }
    }
    return <>
        {apiMessage.length > 0 ? <div className="toast animate__animated animate__fadeInDown notification" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body text-center notf-border position-relative ">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {apiMessage}
            </div>
        </div> : null}
        <div className="bgImage row d-flex justify-content-center align-items-center ">
            <div className="p-5 form-body  col-10 col-md-10 col-lg-4  animate__animated animate__fadeInDown">
                <h2>Sign In</h2>
                <form className='mt-4 mb-3' onSubmit={submitForm}>
                    <label htmlFor="email">Email</label>
                    <div className="mb-4 position-relative">
                        <input onChange={getUSerData} name='email' id='email' type="text" placeholder='Email' className='form-control ' />
                        <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'email')[0]?.message}</small>
                    </div>
                    <label htmlFor="password">Password</label>
                    <div className="mb-4 position-relative">
                        <input onChange={getUSerData} name='password' id='password' type="password" placeholder='Password' className='form-control' />
                        <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'password')[0]?.message.includes('pattern') ? 'Invaild Password : must contain at lease 8 characters' : joiErrors.filter((err) => err.context.label === 'password')[0]?.message}</small>
                        <span onClick={showPass} className="showPass"><i className="fa-solid fa-eye-slash"></i></span>
                    </div>
                    <button className='btn btn-danger fw-bolder mt-2 w-100'>{isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}</button>
                </form>
                <div className='d-flex justify-content-center'><p className='form-or w-100'>OR</p></div>
                <div>
                    <LoginSocialFacebook
                        appId='471915074888949'
                        onResolve={(response) => {
                            if (response?.error) {
                                console.log('error')
                            }
                            else {
                                localStorage.setItem('applogin', JSON.stringify(response.data))
                                setUserProfile(response.data)
                                console.log(response.data)
                                navigate('/')
                            }
                        }}
                    >
                        <FacebookLoginButton />
                    </LoginSocialFacebook>
                    <LoginSocialGoogle
                        client_id='588465717209-e118k4gfb2p6vtgjlu8ppv9bdddpe4e6.apps.googleusercontent.com'
                        onResolve={(response) => {
                            console.log(response.data)
                            localStorage.setItem('applogin', JSON.stringify(response.data))
                            setUserProfile(response.data)
                            navigate('/')
                         
                        }}
                    >
                        <GoogleLoginButton />
                    </LoginSocialGoogle>
                    <LoginSocialGithub
                        client_id='Iv1.d04915231491a362'
                        client_secret='3a5d0c483224fe44d1f23606cba3a0ed817142fd'
                        onResolve={(response) => {
                            localStorage.setItem('applogin', JSON.stringify(response.data))
                            console.log(response.data)
                            setUserProfile(response.data)
                            navigate('/')
                        }}
                        onReject={(error) => {
                            console.log(error)
                        }}
                    >
                        <GithubLoginButton />

                    </LoginSocialGithub>
                    <LoginSocialTwitter
                        client_id='546551737112058'
                        client_secret='790d7e081470a503a7b3734e939cd568'
                        onResolve={(response) => {
                            localStorage.setItem('applogin', JSON.stringify(response.data))
                            console.log(response.data)
                            setUserProfile(response.data)
                            navigate('/')
                        }}
                        onReject={(error) => {
                            console.log(error)
                        }}
                    >
                        <TwitterLoginButton />

                    </LoginSocialTwitter>
                </div>
                <p className='text-secondary mt-3'>New to Noxe? <Link className='text-white' to="/register">Sign up now</Link></p>
            </div>
        </div>
    </>
}