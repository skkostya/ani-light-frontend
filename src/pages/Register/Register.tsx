import './Register.scss';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { toast } from '@/shared/entities';
import { useAppNavigate } from '@/shared/hooks/useAppNavigate';
import { LocalizedLink } from '@/shared/ui';
import { useAppDispatch } from '@/store/store';
import { setUser } from '@/store/user.slice';

import {
  containerStyles,
  descriptionStyles,
  formContainerStyles,
  formStyles,
  getButtonStyles,
  headerStyles,
  textFieldStyles
} from './Register.styles';
import type { RegisterFormData } from './types';

/**
 * Страница регистрации пользователя
 */
const Register: React.FC = () => {
  const { navigate } = useAppNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    mode: 'onChange'
  });

  const password = watch('password');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await userApi.register({
        email: data.email,
        username: data.username,
        password: data.password
      });
      dispatch(setUser(response.user));
      navigate(ROUTES.catalog);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={containerStyles}>
      <Container maxWidth="sm">
        <Card sx={formStyles}>
          <CardContent>
            {/* Заголовок */}
            <Box sx={headerStyles}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component="h1"
                color="primary"
                fontWeight={700}
                textAlign="center"
                mb={1}
              >
                {t('register_title')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={descriptionStyles}
              >
                {t('register_description')}
              </Typography>
            </Box>

            {/* Форма регистрации */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={formContainerStyles}
            >
              {/* Email */}
              <TextField
                {...register('email', {
                  required: t('form_validation_email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('form_validation_email_invalid')
                  }
                })}
                label={t('form_email_label')}
                type="email"
                placeholder={t('form_email_placeholder')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                size="medium"
                sx={textFieldStyles}
              />

              {/* Username */}
              <TextField
                {...register('username', {
                  required: t('form_validation_username_required'),
                  minLength: {
                    value: 3,
                    message: t('form_validation_username_min_length')
                  },
                  maxLength: {
                    value: 20,
                    message: t('form_validation_username_max_length')
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: t('form_validation_username_invalid')
                  }
                })}
                label={t('form_username_label')}
                placeholder={t('form_username_placeholder')}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
                size="medium"
                sx={textFieldStyles}
              />

              {/* Password */}
              <TextField
                {...register('password', {
                  required: t('form_validation_password_required'),
                  minLength: {
                    value: 8,
                    message: t('form_validation_password_min_length')
                  }
                })}
                label={t('form_password_label')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('form_password_placeholder')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                size="medium"
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Confirm Password */}
              <TextField
                {...register('confirmPassword', {
                  required: t('form_validation_confirm_password_required'),
                  validate: (value) =>
                    value === password ||
                    t('form_validation_confirm_password_mismatch')
                })}
                label={t('form_confirm_password_label')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('form_confirm_password_placeholder')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                size="medium"
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Кнопка регистрации */}
              <Button
                type="submit"
                variant="contained"
                size={isMobile ? 'large' : 'medium'}
                disabled={isLoading}
                fullWidth
                sx={getButtonStyles(isMobile)}
              >
                {isLoading ? t('register_submitting') : t('register_button')}
              </Button>

              {/* Ссылка на вход */}
              <Box className="register-link-container">
                <Typography className="register-link-text">
                  {t('register_has_account')}
                </Typography>
                <LocalizedLink
                  to={`/${ROUTES.login}`}
                  className="register-link"
                >
                  {t('register_login_link')}
                </LocalizedLink>
              </Box>

              {/* Ссылка на каталог */}
              <Box className="register-continue-container">
                <LocalizedLink
                  to={`/${ROUTES.catalog}`}
                  className="register-continue-link"
                >
                  {t('register_continue_without_auth')}
                </LocalizedLink>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
