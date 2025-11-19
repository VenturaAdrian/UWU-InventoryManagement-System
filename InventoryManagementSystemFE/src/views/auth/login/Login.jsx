// project-imoports
import AuthLoginForm from 'sections/auth/AuthLogin';
import DotGrid from '../../../components/reactBits/DotGrid';

export default function LoginPage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #d393caff, #814091ff)'
      }}
    >
      <DotGrid
        dotSize={5}
        gap={40}
        baseColor="#e7c0e7"
        activeColor="#5d476bff"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        className="dot-grid-bg"
      />

      {/* Centered login form */}
      <div
        className="auth-main"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 420,          // ⬅ Form max width for responsiveness
          padding: '0 20px',
          zIndex: 10
        }}
      >
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <div className="position-relative" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.41)' }}>
              <AuthLoginForm link="/demos/admin-templates/datta-able/react/free/register" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
