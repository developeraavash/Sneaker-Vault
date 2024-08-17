import { gql, useQuery } from "@apollo/client"
import { Link, useParams } from "react-router-dom"
import Error from "./error"



export default function OrderConfirmation(){
    const param = useParams()

    const GET_ORDER_CONFIRMATION = gql`
        query OrderConfirmation($sessionId:String!) {
            getOrderConfirmation(sessionId:$sessionId) {
                email
                total
                id
            }
        }
    `
    const {data,error,loading} = useQuery<{
        getOrderConfirmation:{
            id:number
            total:number
            email:string
        }
    }>(GET_ORDER_CONFIRMATION,{
        variables:{
            sessionId:param.id
        }
    })
    if(error){
        return <Error/>
    }
     if(loading) {
        return <div>Loading...</div>
     }
    return(
        <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
          <p className="mb-2">Thank you for your purchase!</p>
          <p className="mb-2">Your order ID is: {data?.getOrderConfirmation.id} <span className="font-bold"></span>.</p>
          <p className="mb-4">A confirmation email has been sent to : {data?.getOrderConfirmation.email} <span className="font-bold"></span>.</p>
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Amount : {data?.getOrderConfirmation.total}</span>
          </div>
          <div>
            <Link to={'/collections'} className="underline text-sm text-gray-700" >Continue shopping</Link>
          </div>
        </div>
      </div>
    )
}