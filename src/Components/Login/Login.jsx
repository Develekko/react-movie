import Joi from 'joi'
import React, { useContext, useEffect, useState } from 'react'
import $ from 'jquery'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { AuthContext } from '../../Context/AuthContext'
import { toast} from "react-toastify";
import Cookies from 'universal-cookie'
import jwtDecode from 'jwt-decode'
// import { clientIo } from '../../utlis/socket.js'

export default function Login({saveUserData}) {
    let { userData } = useContext(AuthContext);
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const [joiErrors, setJoiErrors] = useState([]);
    const [isLoading, setisLoading] = useState(false)

    function getUSerData(e) {
        let User = { ...user };
        User[e.target.id] = e.target.value;
        setUser(User);
        $(e.target).next().html('')
    }
    async function sendApiData() {
        try {
            let {data} = await axios.post('https://ecommerce.elafglass.com/auth/signin', user);
            setisLoading(false)
            if (data.status === 'success') {
                new Cookies().set('refreshToken',data.refreshToken,{secure:true,httpOnly:false,expires: new Date(jwtDecode(data.refreshToken)?.exp * 1000)})
                localStorage.setItem('userToken',data.token)
                saveUserData()
                toast.success(data.message,{
                    theme:"dark"
                })
                // clientIo.emit("updateSocketId", { token:`elafglass__${data.token}` })
                navigate('/')
            }
        } catch (error) {
            setisLoading(false)
            toast.error(error.response.data.message,{
                theme:"dark",
            })
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
    useEffect(()=>{
        if(userData !==null)
        {
            navigate('/')
        }
        $('#password').on('input',function()
        {
            if($('#password').val() === '')
            {
                $('.showPass').fadeOut()
            }
            else
            {
                $('.showPass').fadeIn()
            }
        })
    })
        function showPass()
        {
            if ($('#password').attr('type') === "text") 
            {
                $('#password').attr('type','password');
                $('.showPass').html('<i data-show="show" class="fa-solid fa-eye-slash"></i>');
            } else {
                $('#password').attr('type','text');
                $('.showPass').html('<i data-show="show" class="fa-solid fa-eye"></i>');
            }
        }
    return <>
        <div className="bgImage row d-flex justify-content-center align-items-center ">
        <div className="p-5 form-body  col-10 col-md-10 col-lg-4  animate__animated animate__fadeInDown">
            <h2>Sign In</h2>
            <form className='my-4' onSubmit={submitForm}>
                <label htmlFor="email">Email</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='email' id='email' type="text" placeholder='Email' className='form-control ' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'email')[0]?.message}</small>
                </div>
                <label htmlFor="password">Password</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='password' id='password' type="password" placeholder='Password' className='form-control' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'password')[0]?.message.includes('pattern')?'Invaild Password : must contain at lease 8 characters':joiErrors.filter((err) => err.context.label === 'password')[0]?.message}</small>
                    <span onClick={showPass} className="showPass"><i className="fa-solid fa-eye-slash"></i></span>
                </div>
                <button className='btn btn-danger fw-bolder mt-2 mb-3 w-100'>{isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}</button>
            </form>
            <p className='text-secondary'>New to DMovies? <Link className='text-white' to="/register">Sign up now</Link></p>
        </div>
        </div>
    </>
}