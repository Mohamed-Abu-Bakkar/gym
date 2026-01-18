import { useAuth } from '@/components/auth/useAuth';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/app/_user/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {user,isLoading,signIn} = useAuth();
  
  console.log('Rendering /app/management/(user)/ route', {user,isLoading});
  console.log('signIn function:', signIn('1234567890', '123123'));
  
  return <div>Hello "/app/management/(user)/"!</div>
}
