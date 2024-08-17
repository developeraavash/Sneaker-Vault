import { useEffect, useRef } from "react"


interface PaymentFormProps {
    amount:string
    tax_amount:string
    total_amount:string
    transaction_uuid:string
    product_code:string
    product_service_charge:string
    product_delivery_charge:string
    success_url:string
    failure_url:string
    signed_field_names:string
    signature:string
}
export default function PaymentForm(props:PaymentFormProps){
    console.log(props)
    const formRef = useRef<HTMLFormElement>(null)
    useEffect(()=>{
        if(formRef.current) {
            formRef.current.submit()
        }
    },[])
    return(
        <form ref={formRef} className="opacity-0 absolute"  action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
        <input type="text" id="amount" name="amount" value={props.amount} required/>
        <input type="text" id="tax_amount" name="tax_amount" value ={props.tax_amount} required/>
        <input type="text" id="total_amount" name="total_amount" value={props.total_amount} required/>
        <input type="text" id="transaction_uuid" name="transaction_uuid" value={props.transaction_uuid} required/>
        <input type="text" id="product_code" name="product_code" value ={'EPAYTEST'} required/>
        <input type="text" id="product_service_charge" name="product_service_charge" value={props.product_service_charge} required/>
        <input type="text" id="product_delivery_charge" name="product_delivery_charge" value={props.product_delivery_charge} required/>
        <input type="text" id="success_url" name="success_url" value={props.success_url} required/>
        <input type="text" id="failure_url" name="failure_url" value={'https://localhost:3000'} required/>
        <input type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required/>
        <input type="text" id="signature" name="signature" value={props.signature} required/>
        </form>
    )
}