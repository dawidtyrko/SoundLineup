'use client'

import {useRouter} from "next/navigation";
import {updateArtistById} from "@/app/services/artistService";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useAuth} from "@/app/AuthContext";
import classes from "./CreateArtist.module.css";


const EditArtist = ({ artist,onUpdate }) => {
    const router = useRouter();
    const {token} = useAuth()

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters long'),
        age: Yup.number()
            .required('Age is required')
            .min(1, 'Age must be at least 1')
            .max(150, 'Age must be 150 or less'),
        groupName: Yup.string()
            .optional()
            //.required('Group name is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            setSubmitting(true)
            await updateArtistById(artist._id, values,token);
            onUpdate({...artist, ...values});
            router.push(`/profile`);
        } catch (err) {
            setFieldError('general', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={classes.formContainer}>
            <h1 className={classes.headerOne} style={{color: "black"}}>Edit Artist</h1>
            <Formik
                initialValues={{
                    name: artist.name,
                    age: artist.age,
                    groupName: artist.groupId ? artist.groupId.name : '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, errors}) => (
                    <Form>

                        {errors.general && <p className={classes.error}>{errors.general}</p>}

                        <div className={classes.formField}>
                            <label className={classes.labelFields}>
                                Name:
                                <Field type="text" name="name"/>
                                <ErrorMessage name="name" component="div" className="error"/>
                            </label>
                        </div>

                        <div className={classes.formField}>
                            <label className={classes.labelFields}>
                                Age:
                                <Field type="number" name="age"/>
                                <ErrorMessage name="age" component="div" className="error"/>
                            </label>
                        </div>

                        <div className={classes.formField}>
                            <label className={classes.labelFields}>
                                Group Name:
                                <Field type="text" name="groupName"/>
                                <ErrorMessage name="groupName" component="div" className="error"/>
                            </label>
                        </div>

                        <div className={classes.formField}>
                            <button type="submit" disabled={isSubmitting} className={classes.submitBtn}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </Form>
                    )}
            </Formik>
        </div>
            );
            }

            export default EditArtist;