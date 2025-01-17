'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import {updateArtistById} from "@/app/services/artistService";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const EditArtist = ({ artist,onUpdate }) => {
    const router = useRouter();

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
            await updateArtistById(artist._id, values);
            onUpdate({...artist, ...values});
            router.push(`/profile`);
        } catch (err) {
            setFieldError('general', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                name: artist.name,
                age: artist.age,
                groupName: artist.groupId || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors }) => (
                <Form>
                    <h2>Edit Artist</h2>
                    {errors.general && <p>Error: {errors.general}</p>}

                    <label>
                        Name:
                        <Field type="text" name="name" />
                        <ErrorMessage name="name" component="div" className="error" />
                    </label>

                    <label>
                        Age:
                        <Field type="number" name="age" />
                        <ErrorMessage name="age" component="div" className="error" />
                    </label>

                    <label>
                        Group Name:
                        <Field type="text" name="groupName" />
                        <ErrorMessage name="groupName" component="div" className="error" />
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default EditArtist;