import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../ui/modal";
import PasswordForm from "../../ui/passwordForm";
import Spinner from "../../ui/spinner";
import Error from "../error";

interface ProfileForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
}

export default function Profile() {
  const GET_PROFILE = gql`
    query getProfile {
      getProfile {
        id
        email
        firstName
        lastName
        address
        dateOfBirth
      }
    }
  `;
  const UPDATE_PROFILE = gql`
    mutation updateProfile(
      $email: String!
      $lastName: String!
      $address: String!
      $firstName: String!
      $dateOfBirth: String!
    ) {
      updateProfile(
        email: $email
        lastName: $lastName
        firstName: $firstName
        address: $address
        dateOfBirth: $dateOfBirth
      )
    }
  `;
  const [updateProfile, { error: uError, loading: uLoading }] =
    useMutation<ProfileForm>(UPDATE_PROFILE);
  const { data, error, loading } = useQuery<{
    getProfile: { id: string } & ProfileForm;
  }>(GET_PROFILE);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>();
  function onSubmit(data: ProfileForm) {
    setShowSpinner(true);
    const { email, firstName, lastName, address, dateOfBirth } = data;
    updateProfile({
      variables: {
        email,
        firstName,
        lastName,
        address,
        dateOfBirth,
      },
    })
      .then(() => {})
      .catch((err) => {})
      .finally(() => {
        setShowSpinner(false);
      });
  }
  useEffect(() => {
    if (data?.getProfile) {
      reset(data.getProfile);
    }
  }, [data]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  if (error) return <Error />;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="items-center flex-col p-4 gap-2 text-sm flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-2">
        <h5 className=" w-full">Profile</h5>
        <fieldset disabled={isFormDisabled}>
          <div className="flex flex-col gap-6">
            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full border p-2"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-xs absolute">
                  <span className="text-red-500">{errors.email.message}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="p-2 border"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-xs absolute">
                    <span className="text-red-500">
                      {errors.firstName.message}
                    </span>
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="border p-2"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-xs absolute">
                    <span className="text-red-500">
                      {errors.lastName.message}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="relative w-full">
                <input
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className="border p-2 w-full"
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="text-xs absolute">
                    <span className="text-red-500">
                      {errors.address.message}
                    </span>
                  </p>
                )}
              </div>
              <div className="w-full relative">
                <input
                  {...register("dateOfBirth", {
                    required: "Date Of Birth is required",
                  })}
                  type="date"
                  className="border p-2 w-full"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs absolute">
                    <span className="text-red-500">
                      {errors.dateOfBirth.message}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </fieldset>
        <div className="flex flex-col gap-y-2 ">
          <button
            onClick={() => setIsOpenModal(true)}
            type="button"
            style={{ width: "max-content" }}
            className="underline text-xs text-start text-gray-600"
          >
            Change password
          </button>
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <button
            onClick={() => setIsFormDisabled((prev) => !prev)}
            type="button"
            className="bg-gray-200 w-[80px] hover:bg-gray-300 py-1 px-4"
          >
            Edit
          </button>
          <button
            type="submit"
            className="w-[80px] bg-gray-700 text-white py-1 px-4"
          >
            {showSpinner ? <Spinner /> : "Save"}
          </button>
        </div>
      </form>
      {isOpenModal && (
        <Modal>
          <PasswordForm setIsOpenModal={setIsOpenModal} />
        </Modal>
      )}
    </div>
  );
}
