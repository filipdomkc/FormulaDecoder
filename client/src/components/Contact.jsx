import React,{useRef} from 'react';
import emailjs from '@emailjs/browser';
import styled from "styled-components";
import EmailIllustration from '../assets/email-illustration.png'

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_5shn44c', 'template_59275d5', form.current, 'uwcZy1Y533MyE9n5_')
        .then((result) => {
            console.log(result.text);
            e.target.reset();
        }, (error) => {
            console.log(error.text);
        });
    };

    return (
        <div className='w-full h-screen justify-center items-center grid md:grid-cols-2' id="Contact"> 
            <img src={EmailIllustration} alt='/' className='max-w-[300] mx-auto h-auto'/>
            <StyledContactForm className='mx-auto'>
                <form ref={form} onSubmit={sendEmail}>
                    <label>Name</label>
                    <input type="text" name="user_name" placeholder='Name'/>
                    <label>Email</label>
                    <input type="email" name="user_email" placeholder='E-mail'/>
                    <label>Subject</label>
                    <input type="text" name="user_subject" placeholder='Subject'/>
                    <label>Message</label>
                    <textarea name="message" placeholder='Your message'/>
                    <input type="submit" value="Send" />
                </form>
            </StyledContactForm>
        </div>
  )
}

export default Contact

// Styles
const StyledContactForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  
  form {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    font-size: 16px;
    input {
      width: 100%;
      height: 35px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);
      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }
    textarea {
      max-width: 100%;
      min-width: 100%;
      width: 100%;
      max-height: 100px;
      min-height: 100px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);
      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }
    label {
      margin-top: 1rem;
      color:white;
    }
    input[type="submit"] {
      margin-top: 2rem;
      cursor: pointer;
      background: rgb(0, 223, 154);
      color: black;
      border: none;
    }
  }
`;