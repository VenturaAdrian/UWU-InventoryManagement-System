import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import config from 'config';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema, userNameSchema } from 'utils/validationSchema';
import { useNavigate } from 'react-router-dom';
// assets
import DarkLogo from 'assets/images/logo-dark.svg';
import newlogo from 'assets/images/UWU=BANNER=BLACK.png'
import LoginMainCard from 'components/LogInMainCard';
import BTN from '../../components/reactBits/BTN';
// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthLoginForm({ className, link }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = () => {
    reset();
    console.log('WORKING')
    navigate('/other/sample-page', { replace: true })
  };

  const Auth = async (data) => {
    console.log('USERNAME:', data.username, ' && PASSWORD: ', data.password)
    setLoginError('');

    try {
      const res = await axios.get(`${config.baseApi}/authentication/login`, {
        params: { user_name: data.username, pass_word: data.password }
      })


      if (!res.data.error) {
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('status', JSON.stringify([{ id: 0, value: 'Login' }]))

        const userData = res.data;
        reset();
        navigate('/products/product-table', { replace: true });
      }
      else {
        setLoginError(res.data.message || 'Incorrect username or password');
      }
    } catch (err) {
      console.error('LOGIN ERROR: ', err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) {
          setLoginError(err.response.data.message || 'Incorrect username or password');
        } else {
          setLoginError('An error occurred. Please try again.');
        }
      }
    }
  }

  return (
    <LoginMainCard className="mb-0" >
      <div className="text-center">
        <a>
          <Image src={newlogo} alt="img" style={{ width: '100%' }} />
        </a>
      </div>
      <Form onSubmit={handleSubmit(Auth)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}><b>Login</b></h4>
        {loginError && (
          <div className="text-danger text-center mb-3">
            {loginError}
          </div>
        )}
        <Form.Group className="mb-3" controlId="formUsserName">
          <Form.Label style={{ marginBottom: 0 }}><b>Username</b></Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            {...register('username', userNameSchema)}
            isInvalid={!!errors.username}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label style={{ marginBottom: 0 }}><b>Password</b></Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', passwordSchema)}
              isInvalid={!!errors.password}
              className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            />
            <Button onClick={togglePasswordVisibility} style={{ background: ' #8d659c', border: '2px solid #4c194e' }}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label="Remember me?"
              defaultChecked
              className={`input-primary ${className ? className : 'text-muted'} `}
            />
          </Form.Group>
          <a href="#!" className={`text-secondary f-w-400 mb-0  ${className}`}>
            Forgot Password?
          </a>
        </Stack> */}
        <div className="text-center mt-4">

          <BTN type="submit" className="shadow px-sm-4" label={'Login'} />

        </div>

      </Form>

    </LoginMainCard>
  );
}

AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
