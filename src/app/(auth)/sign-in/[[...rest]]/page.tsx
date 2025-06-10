import { SignIn } from "@clerk/nextjs"
import { GoogleAuthButton } from "@/components/global/google-oauth-button"
import { Separator } from "@/components/ui/separator"

const SignInPage = () => {
  return (
    <>
      <SignIn />
    </>
  )
}

export default SignInPage
