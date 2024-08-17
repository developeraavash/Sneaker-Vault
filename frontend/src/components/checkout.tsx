import { useForm } from "react-hook-form";
import AppLogo from "../ui/logo";
import API from "../utils";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { SetStateAction, useState } from "react";
import Spinner from "../ui/spinner";
import Error from "./error";
import clsx from "clsx";
import PaymentForm from "../utils/paymentForm";

interface OrderSummary {
  total: number;
  shippingCharge: number;
  products: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    images: [{ url: string }];
  }[];
}
export default function Checkout() {
  const params = useParams();
  const GET_CHECKOUT_SESSION = gql`
    query checkoutSessionForm($sessionId: String!) {
      getCheckoutForm(sessionId: $sessionId) {
        email
        country
        firstName
        lastName
        address
        apartment
        city
        phone
      }
      getOrderSummary(sessionId: $sessionId) {
        total
        shippingCharge
        products {
          id
          name
          quantity
          price
          images {
            url
          }
        }
      }
    }
  `;
  const { data, error, loading } = useQuery<{
    getCheckoutForm: CheckoutForm;
    getOrderSummary: OrderSummary;
  }>(GET_CHECKOUT_SESSION, {
    variables: {
      sessionId: params.id,
    },
  });
  const [paymentOption,setPaymentOption] = useState<'khalti'|'esewa'|''>('')
  if (error) {
    return <Error />;
  }
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="text-sm p-2 text-gray-800 flex items-center justify-center flex-col">
      <AppLogo />
      <div className="flex justify-center gap-4 flex-col lg:flex-row-reverse">
        {data && data.getOrderSummary && (
          <OrderSummary paymentOption={paymentOption} {...data?.getOrderSummary} sessionId={params.id} />
        )}
        {/* {d && data.getOrderSummary && ( */}
          <CheckoutForm paymentOption={paymentOption} setPaymentOption={setPaymentOption}  {...data?.getCheckoutForm} />
        {/* )} */}
      </div>
    </div>
  );
}

interface CheckoutForm {
  email?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  phone?: string;
  discountCode?: string;
}

type PaymentOption = 'khalti' | 'esewa' | ''
function OrderSummary(props: OrderSummary & { sessionId?: string, paymentOption:PaymentOption }) {
  const [showSpinner, setShowSpinner] = useState(false);

  const APPLY_COUPON_CODE = gql`
    query applyDiscount($sessionId: String!) {
      getDiscount(sessionId: $sessionId)
    }
  `;
  const [applyDiscountCode, setApplyDiscountCode] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [getDiscount] = useLazyQuery(APPLY_COUPON_CODE);
  const [paymentMetaData,setPaymentMetaData] = useState<any>(null)
  return (
    <div className="flex-col w-full gap-y-2 flex">
      <h5 className="w-full px-2 font-semibold">Order summary</h5>
      <div className="w-full flex flex-col gap-y-2">
        {props.products.map((product, i) => (
          <div className="flex items-center px-2 justify-between" key={i}>
            <div className="flex gap-x-2 items-center">
              <img src={product.images[0].url} className="w-[60px]" />
              <div>
                <p>{product.name}</p>
              </div>
            </div>
            <div>
              <span>Quantity: {product.quantity}</span>
            </div>
            <div className="">
              <p>
                RS<span className="font-semibold">{product.price}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2">
          <input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.currentTarget.value)}
            className="w-full border px-2 py-4"
            placeholder="Discount code"
          />
          <button
            onClick={(e) => {
              console.log(discountCode, "discount code");
              if (discountCode === "11111") {
                setApplyDiscountCode((p) => !p);
              }
            }}
            type="button"
            className="bg-gray-200 px-4 py-2"
          >
            {showSpinner ? <Spinner /> : "Apply"}
          </button>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            Subtotal
            <p>
              Rs
              <span className="font-semibold">{props.total}</span>
            </p>
          </div>
          <div className="flex items-center justify-between">
            Shipping
            <p>
              Rs
              <span className="font-semibold">{props.shippingCharge}</span>
            </p>
          </div>
          {applyDiscountCode && (
            <div className="flex items-center justify-between">
              Discount
              <p>
                Rs<span className="font-semibold">{320}</span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            Total
            <div>
              Rs
              <span className="font-semibold">
                {props.total +
                  props.shippingCharge -
                  (applyDiscountCode ? 320 : 0)}
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={async () => {
                if(props.paymentOption===''){
                  return ;
                }
                setShowSpinner(true);
                try {
                  const res = await API.post("/order/create", {
                    sessionId: props.sessionId,
                    paymentOption:props.paymentOption
                  });
                  if (res.status === 200) {
                    if(props.paymentOption==='khalti') {
                      const { paymentUrl } = res.data;
                      window.location.href = paymentUrl;

                    } else {
                      const {paymentMetaData} = res.data
                      console.log(paymentMetaData)
                      if(paymentMetaData){
                        setPaymentMetaData(paymentMetaData)
                      }
                    }
                    } else {

                  }
                } catch (error) {
                } finally {
                  setShowSpinner(false);
                }
              }}
              className="w-full h-[35px] flex items-center justify-center bg-gray-700 text-white p-2"
            >
              {showSpinner ? <Spinner /> : "Checkout"}
            </button>
              {
                paymentMetaData && 
              <PaymentForm {...paymentMetaData} />
              }
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm(props: CheckoutForm & {
  setPaymentOption:React.Dispatch<SetStateAction<'khalti'|'esewa'|''>>
  paymentOption:'khalti'|'esewa'|''
}) {
  const { discountCode, ...checkoutForm } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: { ...checkoutForm },
  });

  const UPDATE_CHECKOUT_FORM = gql`
    mutation updateCheckoutForm(
      $email: String!
      $country: String!
      $firstName: String!
      $lastName: String!
      $address: String!
      $apartment: String
      $city: String!
      $phone: String!
      $discountCode: String
    ) {
      updateCheckoutForm(
        email: $email
        country: $country
        firstName: $firstName
        lastName: $lastName
        address: $address
        apartment: $apartment
        city: $city
        phone: $phone
        discountCode: $discountCode
      )
    }
  `;
  const [updateCheckoutForm, { data, error, loading }] =
    useMutation(UPDATE_CHECKOUT_FORM);
  function onSubmit(data: CheckoutForm) {
    setShowSpinner(true);
    updateCheckoutForm({
      variables: data,
    })
      .then(() => {})
      .catch((err) => {})
      .finally(() => {
        setShowSpinner(false);
      });
  }
  const [showSpinner, setShowSpinner] = useState(false);
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-y-2 flex-col">
        <label className="font-semibold">Contact</label>
        <div>
          <input
            {...register("email", {
              required: "Email is required",
            })}
            className="border px-2 py-4 w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p>
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-y-4">
          <h5>Delivery</h5>
          <div>
            <input
              {...register("country", {
                required: "Country is required",
              })}
              className="border w-full p-2 py-4"
              placeholder="Country/Region"
            />
            {errors.country && (
              <p>
                <span className="text-red-500 text-xs">
                  {errors.country.message}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ">
            <div className="">
              <input
                {...register("firstName", {
                  required: "firstName is required",
                })}
                className="border w-full p-2 py-4"
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="absolute">
                  <span className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </span>
                </p>
              )}
            </div>
            <div className="relative">
              <input
                {...register("lastName", {
                  required: "lastName is required",
                })}
                className="border w-full p-2 py-4"
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="absolute">
                  <span className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div>
            <input
              {...register("address", {
                required: "Address is required",
              })}
              className="border w-full p-2 py-4"
              placeholder="Address"
            />
            {errors.address && (
              <p>
                <span className="text-red-500 text-xs">
                  {errors.address.message}
                </span>
              </p>
            )}
          </div>
          <div>
            <input
              {...register("apartment", {
                required: false,
              })}
              className="border w-full p-2 py-4"
              placeholder="Apartment(optional)"
            />
          </div>
          <div>
            <input
              {...register("city", {
                required: "City is required",
              })}
              className="border w-full p-2 py-4"
              placeholder="City"
            />
            {errors.city && (
              <p>
                <span className="text-red-500 text-xs">
                  {errors.city.message}
                </span>
              </p>
            )}
          </div>
          <div>
            <input
              {...register("phone", {
                required: "Phone is required",
              })}
              className="border w-full p-2 py-4"
              placeholder="phone"
            />
            {errors.phone && (
              <p>
                <span className="text-red-500 text-xs">
                  {errors.phone.message}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h5 className="font-semibold">Payment<span className="text-xs text-gray-500 font-normal">&nbsp;(select any one option)</span></h5>
          <div className="flex gap-x-2">
            <button
            className={clsx('border',{
              'border-blue-700':props.paymentOption==='khalti',
            })}
            type="button"
            onClick={()=>{
              props.setPaymentOption('khalti')
            }}>
              <img className="w-[80px]" src={"/posters/khalti.png"} />
            </button>
            <button 
              className={clsx('border',{
                'border-blue-700':props.paymentOption==='esewa',
              })}
            type="button"
            onClick={()=>{
              props.setPaymentOption('esewa')
            }}>
              <img className="w-[80px]" src={'/posters/esewa.png'} />
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full h-[35px] flex items-center justify-center bg-gray-700 text-white p-2"
          >
            {showSpinner ? <Spinner /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
