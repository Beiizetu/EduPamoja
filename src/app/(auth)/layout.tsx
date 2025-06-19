import { onAuthenticatedUser } from "@/actions/auth"
import BackdropGradient from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import { redirect } from "next/navigation"

type Props = {
  children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
  const user = await onAuthenticatedUser()

  if (user.status === 200) redirect("/callback/sign-in")

  return (
    <div className="container h-screen flex justify-center items-center">
      <div className="flex flex-col w-full items-center py-24">
        <h2 className="text-4xl font-bold text-themeTextWhite">EduPamoja</h2>
        <center>
          <p className="text-themeTextGray leading-tight">
            Network with people from around the world,
          </p>
          <p>Join groups, create your own,</p>
          <p>Eatch courses and become the best version of yourself.</p>
        </center>
        <BackdropGradient
          className="w-4/12 h-2/6 opacity-40"
          container="flex flex-col items-center"
        >
          {children}
        </BackdropGradient>
      </div>
    </div>
  )
}

export default AuthLayout
