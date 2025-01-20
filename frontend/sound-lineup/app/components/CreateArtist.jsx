import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createArtist } from "@/app/services/artistService";

// Define validation schema
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
            // Handle successful registration (e.g., redirect or display a success message)
            router.push('/login');  // Example route after success
        } catch (err) {
            setFieldError("general", err.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Create Artist Account</h1>
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
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className="input"
                            />
                            <ErrorMessage name="name" component="div" className="error" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="age">Age</label>
                            <Field
                                type="number"
                                name="age"
                                id="age"
                                className="input"
                            />
                            <ErrorMessage name="age" component="div" className="error" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                                id="password"
                                className="input"
                            />
                            <ErrorMessage name="password" component="div" className="error" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="input"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                        </div>

                        {isSubmitting && <p>Submitting...</p>}

                        <div className="form-field">
                            <button type="submit" disabled={isSubmitting} className="submit-btn">
                                {isSubmitting ? "Submitting..." : "Create Account"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateArtist;
