import type { AppProps } from 'next/app'
import withAuth from '../components/WithAuth'

function MyApp({ Component, pageProps }: AppProps) {
  const AuthenticatedComponent = withAuth(Component);
  return <AuthenticatedComponent {...pageProps} />
}

export default MyApp