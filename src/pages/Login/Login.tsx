import './Login.scss';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
} from './Login.styles';
import type { LoginFormData } from './types';

/**
 * Страница авторизации пользователя
 */
const Login: React.FC = () => {
  const { navigate } = useAppNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    mode: 'onChange'
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await userApi.login(data);
      dispatch(setUser(response.user));
      navigate(ROUTES.catalog);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Login error:', error);
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
                {t('login_title')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={descriptionStyles}
              >
                {t('login_description')}
              </Typography>
            </Box>

            {/* Форма авторизации */}
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
                size={'medium'}
                sx={textFieldStyles}
              />

              {/* Password */}
              <TextField
                {...register('password', {
                  required: t('form_validation_password_required'),
                  minLength: {
                    value: 6,
                    message: t('form_validation_password_min_length')
                  }
                })}
                label={t('form_password_label')}
                type="password"
                placeholder={t('form_password_placeholder')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                size={'medium'}
                sx={textFieldStyles}
              />

              {/* Кнопка входа */}
              <Button
                type="submit"
                variant="contained"
                size={isMobile ? 'large' : 'medium'}
                disabled={isLoading}
                fullWidth
                sx={getButtonStyles(isMobile)}
              >
                {isLoading ? t('login_submitting') : t('login_button')}
              </Button>

              {/* Ссылка на регистрацию */}
              <Box className="login-link-container">
                <Typography className="login-link-text">
                  {t('login_no_account')}
                </Typography>
                <LocalizedLink
                  to={`/${ROUTES.register}`}
                  className="login-link"
                >
                  {t('login_register_link')}
                </LocalizedLink>
              </Box>

              {/* Ссылка на каталог */}
              <Box className="login-continue-container">
                <LocalizedLink
                  to={`/${ROUTES.catalog}`}
                  className="login-continue-link"
                >
                  {t('login_continue_without_auth')}
                </LocalizedLink>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
