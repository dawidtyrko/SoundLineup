'use client'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {useRouter} from "next/navigation";
import {updateGroup} from "@/app/services/groupService";
import {useAuth} from "@/app/AuthContext";

const EditGroup = ({group,onUpdate}) => {
    const router = useRouter()
    const {token} = useAuth()


    const validationSchema = Yup.object().shape({
        name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters long')
    })

    const handleSubmit = async (values, { setSubmitting,setFieldError }) => {
        try{

            setSubmitting(true)
            await updateGroup(group._id, values,token)
            onUpdate({...group,...values})
            router.push(`/profile`);
        }catch(err){
            setSubmitting(false)
            setFieldError('general',err.message);
        }finally{
            setSubmitting(false);
        }
    }

    return (
        <Formik initialValues={{
            name: group.name
        }}  validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting, errors }) => (
                <Form>
                    <h2>Edit Artist</h2>
                    {errors.general && <p>Error: {errors.general}</p>}

                    <label>
                        Name:
                        <Field type="text" name="name" />
                        <ErrorMessage name="name" component="div" className="error" />
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </Form>
            )}
            </Formik>

    )
}
export default EditGroup;