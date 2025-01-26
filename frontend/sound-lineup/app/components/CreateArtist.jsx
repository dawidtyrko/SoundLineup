import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createArtist } from "@/app/services/artistService";
import classes from "./CreateArtist.module.css";

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters long'),
    age: Yup.number()
        .required('Age is required')
        .min(1, 'Age must be at least 1')
        .max(150, 'Age must be 150 or less'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const CreateArtist = () => {
    const router = useRouter();

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            setSubmitting(true);
            await createArtist(values);
            router.push('/login');
        } catch (err) {
            setFieldError("general", err.message);
        }
    };

    return (
        <div className={classes.formContainer}>
            <h1 className={classes.headerOne} style={{color:"black"}}>Create Artist Account</h1>
            <Formik
                initialValues={{
                    name: '',
                    age: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting,errors }) => (
                    <Form className="form">
                        <div className={classes.formField}>
                            <label htmlFor="name" className={classes.labelFields}>Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className={classes.input}
                            />
                            <ErrorMessage name="name" component="div" className={classes.error} />
                        </div>

                        <div className={classes.formField}>
                            <label htmlFor="age" className={classes.labelFields}>Age</label>
                            <Field
                                type="number"
                                name="age"
                                id="age"
                                className={classes.input}
                            />
                            <ErrorMessage name="age" component="div" className={classes.error}/>
                        </div>

                        <div className={classes.formField}>
                            <label htmlFor="password" className={classes.labelFields}>Password</label>
                            <Field
                                type="password"
                                name="password"
                                id="password"
                                className={classes.input}
                            />
                            <ErrorMessage name="password" component="div" className={classes.error}/>
                        </div>

                        <div className={classes.formField}>
                            <label htmlFor="confirmPassword" className={classes.labelFields}>Confirm Password</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className={classes.input}
                            />
                            <ErrorMessage name="confirmPassword" component="div" className={classes.error}/>
                        </div>

                        {isSubmitting && <p>Submitting...</p>}

                        {errors.general && <div className={classes.error}>{errors.general}</div>}

                        <div className={classes.formField}>
                            <button type="submit" disabled={isSubmitting} className={classes.submitBtn}>
                                {isSubmitting ? "Submitting..." : "Create Account"}
                            </button>
                        </div>

                        <div className={classes.formField}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className={classes.backBtn}
                            >
                                Go Back
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateArtist;
