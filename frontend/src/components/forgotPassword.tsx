
import {useForm} from 'react-hook-form'
import {gql, useMutation} from '@apollo/client'
import API from '../utils'
import { toast } from 'sonner'
import { useEffect } from 'react'
interface ForgotPasswordFormProps {
    email:string
    code:string
    newPassword:string
    confirmPassword:string
}

export default function ForgotPassword(){
    const CHANGE_PASSWORD = gql`
        mutation ChangePassword($email:String!,$code:String!,$newPassword:String!,$confirmPassword:String!) {
            changePassword(email:$email,code:$code,newPassword:$newPassword,confirmPassword:$confirmPassword) 
        }
    `
    const [changePassword,{data,error,loading}] = useMutation<{
        changePassword:boolean
    }>(CHANGE_PASSWORD)
    const {
        register,
        formState:{errors},
        handleSubmit,
        getValues
    } = useForm<ForgotPasswordFormProps>()
    function onSubmit(data:ForgotPasswordFormProps){
        
        try{
            if(data.confirmPassword === data.newPassword)
            changePassword({
                variables:{
                    ...data
                }
            })
        } catch(err){
            console.error(err)
        }
    }
    useEffect(()=>{
        if(data?.changePassword){
            toast.success('Password updated successfully')
        }
    },[data])
    return(
        <div className="flex text-gray-700 flex-col text-sm items-center justify-center">
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 p-4">
            <h5 className='font-semibold '>Forgot password</h5>
                <div>
                    <input 
                    {...register('email',{
                        required:'Email is required'
                    })}
                    className="border p-2" placeholder="email" />
                    {
                        errors.email && 
                        <p>
                            <span className='text-red-500 text-xs' >{errors.email.message}</span>
                        </p>
                    }
                </div>
                <div className="flex flex-col gap-y-2">
                    <input
                     {...register('code',{
                        required:'Code is required'
                    })}
                    className="border p-2" placeholder="code" />
                     {
                        errors.code && 
                        <p>
                            <span className='text-red-500 text-xs' >{errors.code.message}</span>
                        </p>
                    }
                    <button
                    type='button'
                    onClick={async()=>{
                        try{
                            if(getValues('email') && !errors.email){
                                const res = await API("/email-verification", {
                                    method: "POST",
                                    data: { email:getValues('email'), type:'change_password' },
                                  });
                                  if(res.status===200) {
                                    toast.info('Verification code sent to your email')
                                  }
                            }
                        } catch(err){
                            console.error(err)
                        }
                    }}
                    className="text-xs self-end hover:underline text-gray-600">send code</button>
                </div>
                <div>
                    <input 
                    type='password'
                     {...register('newPassword',{
                        required:'New password is required'
                    })}
                  
                    className="border p-2" placeholder="New password" />
                      {
                        errors.newPassword && 
                        <p>
                            <span className='text-red-500 text-xs' >{errors.newPassword.message}</span>
                        </p>
                    }
                </div>
                <div>
                    <input 
                    type='password'
                     {...register('confirmPassword',{
                        required:'Current password is required'
                    })}
                   
                    className="border p-2" placeholder="Current password" />
                     {
                        errors.confirmPassword && 
                        <p>
                            <span className='text-red-500 text-xs' >{errors.confirmPassword.message}</span>
                        </p>
                    }
                </div>
                <div className="text-end">
                    <button className="bg-gray-700 text-white px-4 py-2" >Submit</button>
                </div>
            </form>
        </div>
    )
}