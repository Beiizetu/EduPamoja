import "next"

declare global {
  namespace NextJS {
    interface PageProps<P = {}, Q = {}> {
      params: P
      searchParams: Q
    }
  }
}
