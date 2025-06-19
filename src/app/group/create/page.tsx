import { onAuthenticatedUser } from "@/actions/auth"
import { onGetAffiliateInfo } from "@/actions/groups"
import CreateGroup from "@/components/forms/create-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

interface SearchParams {
  affiliate?: string
}

interface AffiliateInfo {
  status: number
  user?: {
    Group?: {
      User: {
        image?: string
        firstname?: string
        lastname?: string
        stripeId?: string
      }
    }
  }
  error?: string
}

const GroupCreatePage = async ({
  searchParams,
}: {
  searchParams: SearchParams
}) => {
  // Get headers properly
  const headersList = headers()
  const cspHeader = headersList.get("Content-Security-Policy")

  // Get user and affiliate data
  const user = await onAuthenticatedUser()
  const affiliate: AffiliateInfo = searchParams.affiliate
    ? await onGetAffiliateInfo(searchParams.affiliate)
    : { status: 404 }

  if (user?.status !== 200) {
    return (
      <div className="px-7 flex flex-col items-center justify-center h-[60vh] gap-2">
        <h5 className="font-bold text-base text-themeTextWhite">
          {user?.status === 404
            ? "Please sign in to create a group"
            : "Failed to load user data"}
        </h5>
        {user?.error && (
          <p className="text-sm text-themeTextGray">Error: {user.error}</p>
        )}
      </div>
    )
  }

  if (!user.id) {
    redirect("/sign-in")
  }

  return (
    <>
      <div className="px-7 flex flex-col">
        <h5 className="font-bold text-base text-themeTextWhite">
          Payment Method
        </h5>
        <p className="text-themeTextGray leading-tight">
          Free for 14 days, then $99/month. Cancel anytime. All features.
          Unlimited everything. No hidden fees.
        </p>
        {affiliate.status === 200 && affiliate.user?.Group?.User && (
          <div className="w-full mt-5 flex justify-center items-center gap-x-2 italic text-themeTextGray text-sm">
            You were referred by
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={affiliate.user.Group.User.image}
                alt="Referrer"
              />
              <AvatarFallback className="strokeWidth={1.5}">
                <User size={16} strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            {affiliate.user.Group.User.firstname}{" "}
            {affiliate.user.Group.User.lastname}
          </div>
        )}
      </div>

      <CreateGroup
        userId={user.id}
        affiliate={affiliate.status === 200}
        stripeId={affiliate.user?.Group?.User.stripeId || ""}
      />
    </>
  )
}

export default GroupCreatePage
