import Joi from 'joi'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register() {

    const navigate = useNavigate()
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        age: 0,
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
            let { data } = await axios.post('https://ecommerce.elafglass.com/auth/signup', user);
            setisLoading(false)
            if (data.status === 'success') {
                toast.success(data.message)
                navigate('/login')
            }
        } catch (error) {
            setisLoading(false)
            toast.error(error.response.data.message)
        }
    }
    function submitForm(e) {
        e.preventDefault();
        setisLoading(true)
        const schema = Joi.object({
            first_name: Joi.string().min(3).max(20).required(),
            last_name: Joi.string().min(3).max(20).required(),
            age: Joi.number().min(16).max(80).required(),
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
        <div className="p-5 form-body  col-11 col-md-10 col-lg-4 animate__animated animate__fadeInDown">
            <h2>Sign Up</h2>
            <form className='my-4' onSubmit={submitForm}>
                <label htmlFor="first_name">First Name</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='first_name' id='first_name' type="text" placeholder='First name' className='form-control' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'first_name')[0]?.message}</small>
                </div>
                <label htmlFor="last_name">Last Name</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='last_name' id='last_name' type="text" placeholder='Last name' className='form-control' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'last_name')[0]?.message}</small>
                </div>
                <label htmlFor="age">age</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='age' id='age' type="text" placeholder='age' className='form-control ' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'age')[0]?.message}</small>
                </div>
                <label htmlFor="email">email</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='email' id='email' type="text" placeholder='email' className='form-control' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'email')[0]?.message}</small>
                </div>
                <label htmlFor="password">password</label>
                <div className="mb-4 position-relative">
                    <input onChange={getUSerData} name='password' id='password' type="password" placeholder='password' className='form-control' />
                    <small className='text-danger error-form position-absolute mt-1'>{joiErrors.filter((err) => err.context.label === 'password')[0]?.message.includes('pattern')?'Invaild Password : must contain at lease 8 characters':joiErrors.filter((err) => err.context.label === 'password')[0]?.message}</small>
                    <span onClick={showPass} className="showPass"><i className="fa-solid fa-eye-slash"></i></span>
                </div>
                <button className='btn btn-danger fw-bolder mt-2 w-100'>{isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Register'}</button>
            </form>
            <p className='text-secondary'>Already have account? <Link className='text-white' to="/login">Sign In</Link></p>
        </div>
        </div>
    </>
}