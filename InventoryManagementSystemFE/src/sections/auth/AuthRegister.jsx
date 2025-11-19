import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { confirmPasswordSchema, userRoleSchema, userTierSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema, userNameSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';
import RegMainCard from '../../components/RegMainCard';

// ==============================|| AUTH REGISTER FORM ||============================== //

export default function AuthRegisterForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [RegError, setRegError] = useState('');
  const empInfo = JSON.parse(localStorage.getItem('user'));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };


  const onSubmit = async (data) => {
    try {
      // Check if username or email exists
      const { data: check } = await axios.get(
        `${config.baseApi}/authentication/user-checker`,
        {
          params: {
            user_name: data.username,
            user_email: data.email
          }
        }
      );

      if (check.usernameExists) {
        setRegError("Username already exists. Please choose a different username.");
        return;
      }

      if (check.emailExists) {
        setRegError("Email already exists. Please use a different email.");
        return;
      }

      // Password match check
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Both Password must be match!"
        });
        return;
      }

      // Clear error
      setRegError("");
      clearErrors("confirmPassword");

      // Submit registration
      await axios.post(`${config.baseApi}/authentication/register`, {
        first_name: data.firstName,
        last_name: data.lastName,
        user_name: data.username,
        user_email: data.email,
        user_role: data.userRole,
        user_tier: data.userTier,
        pass_word: data.password,
        created_by: empInfo.user_name
      });

      window.location.reload();

    } catch (error) {
      console.error(error);
      setRegError("Something went wrong. Please try again.");
    }
  };


  return (
    <RegMainCard className="mb-0">
      <div className="text-center">
        <a>
          <Image src={DarkLogo} alt="img" />
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Sign up</h4>
        {RegError && (
          <div className="text-danger text-center mb-3">
            {RegError}
          </div>
        )}
        <Row>
          {/* First Name */}
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label style={{ marginBottom: 0 }}><b>First name</b></Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                {...register('firstName', firstNameSchema)}
                isInvalid={!!errors.firstName}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              />
              <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Last Name */}
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label style={{ marginBottom: 0 }}><b>Last name</b></Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                {...register('lastName', lastNameSchema)}
                isInvalid={!!errors.email}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              />
              <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Username */}
        <Form.Group className="mb-3" controlId="formUserName">
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

        {/* Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label style={{ marginBottom: 0 }}><b>Email</b></Form.Label>
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {/*Role*/}
        <Form.Group className="mb-3" controlId="formUserRole">
          <Form.Label style={{ marginBottom: 0 }}><b>Role</b></Form.Label>
          <Form.Select
            {...register('userRole', userRoleSchema)}
            isInvalid={!!errors.userRole}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            defaultValue=""
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.userRole?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/*Tier*/}
        <Form.Group className="mb-3" controlId="formUserTier">
          <Form.Label style={{ marginBottom: 0 }}><b>Tier</b></Form.Label>
          <Form.Select
            {...register('userTier', userTierSchema)}
            isInvalid={!!errors.userTier}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            defaultValue=""
          >
            <option value="" disabled>
              Select Tier
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.userTier?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password */}
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
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label style={{ marginBottom: 0 }}><b>Confirm password</b></Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', confirmPasswordSchema)}
            isInvalid={!!errors.confirmPassword}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
        </Form.Group>

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Sign up
          </Button>
        </div>
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Already have an Account?</h6>
          <a href={link} className="link-primary">
            Login
          </a>
        </Stack>
      </Form>
    </RegMainCard>
  );
}

AuthRegisterForm.propTypes = { className: PropTypes.string, link: PropTypes.string };
