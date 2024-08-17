import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="border text-gray-700 flex justify-center gap-y-5 gap-x-10 p-2">
      <div className="flex flex-col gap-y-4">
        <h5 className="font-semibold">Contact us</h5>
        <div className="text-sm flex flex-col ">
          <div className="flex flex-col">
            Please email us at any time at
            <a
              className="hover:underline"
              href="mailto:narenmagarz98@gmail.com"
            >
              narenmagarz98@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <h5 className="font-semibold">Policies</h5>
        <div className="flex flex-col text-sm gap-y-5">
          <Link className="hover:underline" to={"faqs"}>
            FAQs
          </Link>
          <Link className="hover:underline" to={"contact-us"}>
            Contact Us
          </Link>
          <Link className="hover:underline" to={"refund-policy"}>
            Refund Policy
          </Link>
          <Link className="hover:underline" to={"shipping-policy"}>
            Privay Policy
          </Link>
          <Link className="hover:underline" to={"/terms-of-service"}>
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
