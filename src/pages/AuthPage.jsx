import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { authService, AuthError } from '../services/authService.js';

const slides = [
  { image: '/images/heritage/essence-10-royal-dark-marble.png', eyebrow: 'The House of SRK', title: 'The essence of elegance', copy: 'Discover a signature crafted to leave an unforgettable impression.' },
  { image: '/images/heritage/essence-03-shanaya-corridor.png', eyebrow: 'A lasting impression', title: 'Crafted to be remembered', copy: 'Every note tells a story of quiet sophistication.' },
  { image: '/images/heritage/essence-07-gift-set-silk.png', eyebrow: 'Precious compositions', title: 'The art of fragrance', copy: 'Exceptional ingredients. Distinctive character.' },
  { image: '/images/campaign/hero-captivating-gift-set-v2.png', eyebrow: 'Made personal', title: 'Define your signature', copy: 'Find the fragrance that becomes uniquely yours.' },
];

const GoogleIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.5c2-1.9 3.2-4.6 3.2-7.9Z"/><path fill="#34A853" d="M12 22c2.9 0 5.3-.9 7-2.6l-3.5-2.8c-.9.7-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.6v2.8A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.2 13.3A6 6 0 0 1 6 12c0-.5 0-.9.2-1.3V7.9H2.6A10 10 0 0 0 2 12c0 1.5.3 2.9.9 4.1l3.3-2.8Z"/><path fill="#EA4335" d="M12 6.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A10 10 0 0 0 2.6 7.9l3.6 2.8C7 8.2 9.3 6.4 12 6.4Z"/></svg>;
const AppleIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.1 12.6c0-2.8 2.3-4.1 2.4-4.2a5.1 5.1 0 0 0-4-2.1c-1.7-.2-3.3 1-4.1 1s-2.1-1-3.5-1C6.1 6.4 4.4 7.5 3.5 9c-1.9 3.3-.5 8.2 1.3 10.8.9 1.3 2 2.7 3.4 2.6 1.3-.1 1.8-.9 3.5-.9 1.6 0 2.1.9 3.5.8 1.5 0 2.4-1.3 3.3-2.6a11.8 11.8 0 0 0 1.5-3.1c-.1 0-2.9-1.1-2.9-4Zm-2.7-8.1c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.6 3.2-1.5Z"/></svg>;

function Spinner() { return <span className="auth-spinner" aria-hidden="true"/>; }

function LuxuryCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);
  return <section className="auth-visual" aria-roledescription="carousel" aria-label="SRK Fragrance campaign">
    {slides.map((slide, index) => <article key={slide.image} className={`auth-slide${index === active ? ' is-active' : ''}`} aria-hidden={index !== active}>
      <img src={slide.image} alt=""/><div className="auth-slide-shade"/><div className="auth-slide-copy"><p>{slide.eyebrow}</p><h2>{slide.title}</h2><span>{slide.copy}</span></div>
    </article>)}
    <div className="auth-slide-controls"><span>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><div>{slides.map((slide, index) => <button key={slide.image} type="button" className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} aria-current={index === active ? 'true' : undefined}/>)}</div></div>
  </section>;
}

function OtpForm({ challenge, onBack, onVerified, onResend, busy, setBusy, setError }) {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [remaining, setRemaining] = useState(45);
  const refs = useRef([]);
  useEffect(() => { if (!remaining) return; const timer = window.setInterval(() => setRemaining((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [remaining]);
  const update = (index, value) => {
    const number = value.replace(/\D/g, '').slice(-1); const next = [...digits]; next[index] = number; setDigits(next);
    if (number && index < 5) refs.current[index + 1]?.focus();
  };
  const submit = async (event) => {
    event.preventDefault(); const code = digits.join('');
    if (code.length !== 6) return setError('Enter the complete 6-digit verification code.');
    setBusy('verify'); setError('');
    try { onVerified(await authService.verifyOtp(challenge.id, code, challenge.intent)); } catch (error) { setError(error.message); } finally { setBusy(''); }
  };
  const paste = (event) => { const value = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6); if (!value) return; event.preventDefault(); setDigits([...value.padEnd(6, '')]); refs.current[Math.min(value.length, 5)]?.focus(); };
  return <div className="auth-state auth-verify"><button className="auth-back" type="button" onClick={onBack}>← Change {challenge.kind}</button><p className="auth-kicker">One final step</p><h1>Verify your identity</h1><p className="auth-intro">We sent a six-digit code to <strong>{challenge.masked || challenge.identifier}</strong>.</p>
    <form onSubmit={submit}><fieldset disabled={Boolean(busy)}><legend className="sr-only">Six-digit verification code</legend><div className="otp-row" onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(node) => { refs.current[index] = node; }} value={digit} onChange={(event) => update(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !digits[index] && index) refs.current[index - 1]?.focus(); }} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`Digit ${index + 1}`} maxLength="1" autoFocus={index === 0}/>)}</div></fieldset>
      <button className="auth-primary" disabled={Boolean(busy)}>{busy === 'verify' && <Spinner/>}{busy === 'verify' ? 'Verifying…' : 'Verify & continue'}</button>
    </form><div className="resend-line">{remaining ? <span>Request a new code in 0:{String(remaining).padStart(2, '0')}</span> : <button type="button" disabled={Boolean(busy)} onClick={async () => { setRemaining(45); await onResend(); }}>Resend code</button>}</div>
  </div>;
}

function ProfileForm({ token, initialIdentifier, requiredFields, busy, setBusy, setError, onComplete }) {
  const isEmail = initialIdentifier.includes('@');
  const [form, setForm] = useState({ fullName: '', email: isEmail ? initialIdentifier : '', mobile: isEmail ? '' : initialIdentifier });
  const submit = async (event) => { event.preventDefault(); setBusy('register'); setError(''); try { await authService.completeRegistration(form, token); onComplete(); } catch (error) { setError(error.message); } finally { setBusy(''); } };
  return <div className="auth-state"><p className="auth-kicker">Your private profile</p><h1>Tell us your name</h1><p className="auth-intro">A few essentials, so we can make your SRK experience personal.</p><form className="auth-profile" onSubmit={submit}>
    {requiredFields.includes('fullName') && <label>Full name<input required autoComplete="name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })}/></label>}
    {requiredFields.includes('email') && <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })}/></label>}
    {requiredFields.includes('mobile') && <label>Mobile number<input required type="tel" autoComplete="tel" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })}/></label>}
    <button className="auth-primary" disabled={Boolean(busy)}>{busy === 'register' && <Spinner/>}{busy === 'register' ? 'Creating your account…' : 'Create account'}</button></form></div>;
}

export default function AuthPage() {
  const location = useLocation(); const navigate = useNavigate(); const [params] = useSearchParams();
  const initialMode = location.pathname === '/register' || location.state?.mode === 'register' ? 'register' : 'login';
  const oauthError = params.get('error');
  const [mode, setMode] = useState(initialMode); const [step, setStep] = useState('entry'); const [identifier, setIdentifier] = useState('');
  const [challenge, setChallenge] = useState(null); const [profileToken, setProfileToken] = useState(''); const [profileFields, setProfileFields] = useState(['fullName']); const [busy, setBusy] = useState('');
  const [error, setError] = useState(() => oauthError ? (oauthError === 'access_denied' ? 'Sign-in was cancelled. You can try again whenever you are ready.' : 'Social sign-in could not be completed. Please try again.') : '');
  const returnTo = params.get('returnTo')?.startsWith('/') ? params.get('returnTo') : '/';
  useEffect(() => { authService.getSession().then((session) => { if (session?.user) navigate(returnTo, { replace: true }); }).catch(() => {}); }, [navigate, returnTo]);
  const validate = () => { const value = identifier.trim(); const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; const digits = value.replace(/[\s()-]/g, ''); if (email.test(value)) return { value: value.toLowerCase(), kind: 'email' }; if (/^\+?\d{8,15}$/.test(digits)) return { value: digits, kind: 'mobile number' }; throw new AuthError('Enter a valid email address or mobile number, including country code.'); };
  const sendCode = async (event) => { event?.preventDefault(); setError(''); let parsed; try { parsed = validate(); } catch (validationError) { return setError(validationError.message); } setBusy('otp'); try { const result = await authService.requestOtp(parsed.value, mode); const next = { id: result.challengeId, masked: result.maskedDestination, identifier: parsed.value, kind: parsed.kind, intent: mode }; setChallenge(next); setStep('verify'); navigate('/verify', { replace: true, state: { fromAuth: true, mode } }); } catch (requestError) { setError(requestError.message); } finally { setBusy(''); } };
  const switchMode = () => { const next = mode === 'login' ? 'register' : 'login'; setMode(next); setStep('entry'); setError(''); navigate(`/${next}`, { replace: true }); };
  const oauth = (provider) => { setError(''); setBusy(provider); try { authService.beginOAuth(provider, returnTo); } catch (oauthError) { setError(oauthError.message); setBusy(''); } };
  const finish = () => navigate(returnTo, { replace: true });
  const verified = (result) => { if (result.requiresProfile) { setProfileToken(result.verificationToken); setProfileFields(result.requiredFields?.length ? result.requiredFields : ['fullName']); setStep('profile'); } else finish(); };

  return <main className="auth-page"><LuxuryCarousel/><section className="auth-panel"><div className="auth-panel-inner"><header className="auth-header"><Link className="auth-brand" to="/"><span>SRK</span><small>FRAGRANCE</small></Link><Link className="auth-close" to={returnTo} aria-label="Close authentication">×</Link></header>
    <div className="auth-form-shell" aria-live="polite">{error && <div className="auth-error" role="alert"><span>!</span><p>{error}</p><button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      {step === 'verify' && challenge ? <OtpForm challenge={challenge} onBack={() => { setStep('entry'); navigate(`/${mode}`, { replace: true }); }} onVerified={verified} onResend={sendCode} busy={busy} setBusy={setBusy} setError={setError}/>
      : step === 'profile' ? <ProfileForm token={profileToken} initialIdentifier={challenge?.identifier || identifier} requiredFields={profileFields} busy={busy} setBusy={setBusy} setError={setError} onComplete={finish}/>
      : <div className="auth-state"><p className="auth-kicker">{mode === 'login' ? 'Welcome back' : 'Join the house'}</p><h1>{mode === 'login' ? 'Welcome to SRK Fragrance' : 'Create your SRK account'}</h1><p className="auth-intro">{mode === 'login' ? 'Sign in to continue your fragrance journey.' : 'Begin a more personal fragrance journey.'}</p>
        <div className="social-auth"><button type="button" disabled={Boolean(busy)} onClick={() => oauth('google')}>{busy === 'google' ? <Spinner/> : <GoogleIcon/>}<span>{busy === 'google' ? 'Connecting to Google…' : 'Continue with Google'}</span></button><button type="button" disabled={Boolean(busy)} onClick={() => oauth('apple')}>{busy === 'apple' ? <Spinner/> : <AppleIcon/>}<span>{busy === 'apple' ? 'Connecting to Apple…' : 'Continue with Apple'}</span></button></div>
        <div className="auth-divider"><span>or</span></div><form className="identifier-form" onSubmit={sendCode}><label htmlFor="auth-identifier">Mobile number or email</label><input id="auth-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} type="text" inputMode="email" autoComplete="username" placeholder="Enter mobile number or email" aria-describedby="identifier-help"/><small id="identifier-help">For mobile, include your country code (for example, +91).</small><button className="auth-primary" disabled={Boolean(busy)}>{busy === 'otp' && <Spinner/>}{busy === 'otp' ? 'Sending code…' : 'Continue'}</button></form>
        <p className="auth-switch">{mode === 'login' ? 'New to SRK Fragrance?' : 'Already have an account?'} <button type="button" onClick={switchMode}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
      </div>}
    </div><footer className="auth-legal">By continuing, you agree to SRK Fragrance&apos;s <Link to="/contact#terms">Terms &amp; Conditions</Link> and <Link to="/contact#privacy">Privacy Policy</Link>.</footer></div></section></main>;
}
