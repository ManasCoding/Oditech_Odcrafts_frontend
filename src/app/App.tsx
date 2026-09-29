import { Providers } from './Providers';
import { Router } from './Router';
import SplashCursor from '../components/SplashCursor.js'
export default function App() {

  
  return (
    <Providers>
      <SplashCursor
  DENSITY_DISSIPATION={4.5}
  VELOCITY_DISSIPATION={2}
  PRESSURE={0.1}
  CURL={3}
  SPLAT_RADIUS={0.04}
  SPLAT_FORCE={3500}
  COLOR_UPDATE_SPEED={10}
  SHADING
  RAINBOW_MODE={false}
  COLOR="#EAB308"
/>
      <Router />
    </Providers>
  );
}
