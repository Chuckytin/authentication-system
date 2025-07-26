# Authify - Sistema de Autenticación

Microservicio de autenticación con Spring Boot que incluye registro, login, verificación por OTP y recuperación de contraseña.

## Características Principales

- **Autenticación JWT** con cookies HTTP-Only
- **Verificación en dos pasos** por correo electrónico
- **Recuperación segura** de contraseña con OTP
- **Integración con MySQL** y Brevo (Sendinblue) para emails
- **Gestión de perfiles** de usuario
- **Protección CSRF** integrada
- **API RESTful** con validación de parámetros

## Stack Tecnológico

- **Backend**: Java 21 + Spring Boot 3.5.3
- **Seguridad**: Spring Security 6 + JJWT 0.12.6 
- **Base de datos**: MySQL 8+ 
- **Email**: Brevo (Sendinblue) SMTP  
- **Herramientas**:
  - Lombok
  - MapStruct
  - Hibernate Validator

## Endpoints API

### Autenticación
| Método | Endpoint            | Descripción                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/v1/login`     | Autenticación con JWT                |
| GET    | `/api/v1/is-authenticated` | Verifica sesión activa        |

### Gestión de Cuenta
| Método | Endpoint                  | Descripción                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/v1/send-otp`        | Envía OTP para verificación          |
| POST   | `/api/v1/verify-otp`      | Valida OTP de verificación           |
| POST   | `/api/v1/send-reset-otp`  | Envía OTP para recuperar contraseña  |
| POST   | `/api/v1/reset-password`  | Restablece contraseña con OTP        |

### Perfil de Usuario
| Método | Endpoint            | Descripción                          |
|--------|---------------------|--------------------------------------|
| POST | `/api/v1/register`    | Registra nuevo usuario               |
| GET  | `/api/v1/profile`     | Obtiene datos del perfil             |
| POST | `/api/v1/logout`      | Cierra la sesión del usuario         |

## Configuración

### Variables de Entorno (`.env`)
```properties
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=authify_db
DB_USER=usuario
DB_PASS=contraseña

# JWT
JWT_SECRET_KEY=tu_clave_secreta_32_chars_min

# Email (Brevo)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@dominio.com
MAIL_PASSWORD=tu_api_key_brevo
MAIL_FROM=no-reply@tudominio.com
