import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createGroup } from "@/app/services/groupService";


const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters long'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const CreateGroup = () => {
    const router = useRouter();

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            setSubmitting(true);
            await createGroup(values);
            router.push('/login');
        } catch (err) {
            setFieldError("general", err.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Create Group Account</h1>
            <Formik
                initialValues={{
                    name: '',
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
                            <ErrorMessage name="name" component="div" className="error"/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                                id="password"
                                className="input"
                            />
                            <ErrorMessage name="password" component="div" className="error"/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="input"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error"/>
                        </div>

                        {isSubmitting && <p>Submitting...</p>}

                        <div className="form-field">
                            <button type="submit" disabled={isSubmitting} className="submit-btn">
                                {isSubmitting ? "Submitting..." : "Create Account"}
                            </button>
                        </div>

                        <div className="form-field">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="back-btn"
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

export default CreateGroup;
