import { CardActionArea, Card, CardMedia, CardContent, Typography, TextField, FormControl, Button, InputLabel, Select, MenuItem, FormControlLabel, Switch, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';
import { useRef } from "react";


export default function Contact() {

    const form = useRef();
    //EmailJS
    const sendEmail = (e) => {
        // e.preventDefault();
    
        emailjs.sendForm('service_8mk833q', 'template_gbuspnd', form.current, 'XI3drcv-b1EjzbR25')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      };

    // Validate inputs
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            message: ""

        },
        onSubmit: (values) => {            
            sendEmail();
            alert("I will contact you soon")
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required.").min(2, "Must be 2 characters or more"),
            email: Yup.string().required("Required.").email("Invalid email"),
            phone: Yup.number().integer().typeError("Please enter a valid number"),
            program: Yup.number().integer().typeError("Please select a program."),
            message: Yup.string().required("Required.").min(10, "Must be 10 characters or more"),
            agree: Yup.boolean().oneOf([true], "The terms and conditions must be accepted.")
        }),

    });

    return (
        <div className="contact-container">
            <Button variant="contained" className='back-button'><ArrowBackIcon />&nbsp;<Link to="/">Back</Link></Button>
            <h1>Contact me via: </h1>
            <a href="mailto:trungthongnguyen2002@gmail.com">
                <Card className='card' sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://i.pinimg.com/originals/0c/c6/b8/0cc6b8b086ba0f9b40759f955ca532a5.gif"
                            alt="email"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Email
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Contact me via emails
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </a>

            <a href="#Call">
                <Card className='card' sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://i.pinimg.com/originals/fb/2e/3c/fb2e3c79c3b4fd757275ec1bd4ba6aa8.gif"
                            alt="email"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Call
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Contact me via: 0365960823
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </a>

            <a href="https://www.linkedin.com/in/thongnt0208/">
                <Card className='card' sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://i.pinimg.com/originals/d3/3b/d9/d33bd9baa83a336184055c07dc8ccaa8.gif"
                            alt="email"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                LinkedIn
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Contact me via linkedin.com/in/thongnt0208/
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </a>

            <div className="inputs">
                <h1>or let I contact you:</h1>
                <form ref={form} onSubmit={formik.handleSubmit}>
                    <TextField className="text-field"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        color="success"
                    />
                    {formik.errors.name && (<Typography variant="caption" color="red" class="input-noti">{formik.errors.name}</Typography>)}
                    <TextField className="text-field"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        color="success"
                    />
                    {formik.errors.email && (<Typography variant="caption" color="red" class="input-noti">{formik.errors.email}</Typography>)}
                    <TextField className="text-field"
                        label="Phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        color="success"
                    />
                    {formik.errors.phone && (<Typography variant="caption" color="red" class="input-noti">{formik.errors.phone}</Typography>)}
                    
                    <TextField className="text-field"
                        id="outlined-multiline-static"
                        label="Message"
                        multiline
                        name='message'
                        rows={4}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        color="success"
                    />
                    {formik.errors.message && (<Typography variant="caption" color="red" class="input-noti">{formik.errors.message}</Typography>)}
                    
                    <Button
                        className="btn"
                        type='submit'
                        color="success">
                        Send
                    </Button>
                </form>

            </div>

        </div>
    )
}