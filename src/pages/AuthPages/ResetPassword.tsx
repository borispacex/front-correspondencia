import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm.tsx";

export default function ResetPassword() {
    return (
        <>
            <AuthLayout>
                <ResetPasswordForm />
            </AuthLayout>
        </>
    );
}
