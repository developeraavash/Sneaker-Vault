import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import Spinner from "./spinner";
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export default function PasswordForm(props: {
  setIsOpenModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PasswordForm>();
  const UPDATE_PASSWORD = gql`
    mutation updateProfile(
      $currentPassword: String!
      $newPassword: String!
      $confirmPassword: String!
    ) {
      updatePassword(
        currentPassword: $currentPassword
        newPassword: $newPassword
        confirmPassword: $confirmPassword
      )
    }
  `;
  const [updatePassword, { error, data, loading }] =
    useMutation(UPDATE_PASSWORD);

  function onFormSubmit(data: PasswordForm) {
    setShowSpinner(true);
    updatePassword({
      variables: { ...data },
    })
      .then(() => {})
      .catch((err) => {})
      .finally(() => {
        setShowSpinner(false);
      });
  }
  const [showSpinner, setShowSpinner] = useState(false);
  return (
    <div>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex rounded gap-y-4 bg-white flex-col p-4"
      >
        <h5 className="text-gray-700 font-semibold">Change Password</h5>
        <div>
          <input
            {...register("currentPassword", {
              required: "Current password required",
            })}
            className="border p-2"
            placeholder="Current password"
          />
          {errors.currentPassword && (
            <p className="text-xs">
              <span className="text-red-500">
                {errors.currentPassword.message}
              </span>
            </p>
          )}
        </div>
        <div>
          <input
            {...register("newPassword", {
              required: "New password required",
            })}
            className="border p-2"
            placeholder="New password"
          />
          {errors.newPassword && (
            <p className="text-xs">
              <span className="text-red-500">{errors.newPassword.message}</span>
            </p>
          )}
        </div>
        <div>
          <input
            {...register("confirmPassword", {
              required: "confirm password required",
            })}
            className="border p-2"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-xs">
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            </p>
          )}
        </div>
        <div className="flex justify-end gap-x-2">
          <button
            onClick={() => props.setIsOpenModal(false)}
            type="button"
            className="bg-gray-200 w-[80px] p-2 text-xs"
          >
            Discard
          </button>
          <button
            type="submit"
            className="bg-gray-700 w-[80px] h-[35px] text-white text-xs p-2"
          >
            {showSpinner ? <Spinner /> : "Change"}
          </button>
        </div>
      </form>
    </div>
  );
}
