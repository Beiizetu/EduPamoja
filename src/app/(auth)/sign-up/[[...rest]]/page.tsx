import { SignUp } from "@clerk/nextjs"
import { GoogleAuthButton } from "@/components/global/google-oauth-button"
import { Separator } from "@/components/ui/separator"

type Props = {}

const SignUpPage = (props: Props) => {
  return (
    <>
      <SignUp />
    </>
  )
}

export default SignUpPage
