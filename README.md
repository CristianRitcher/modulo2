Proyecto: Correos de méxico
Módulo: Autenticación
Equipo: 2

Submódulos:
    - Inicio de sesión
    - Registro de usuario
    - Cambio de contraseña



Desarrolladores:
    Front-end:
        - Antelmo 
        - Rosales
        - Conde
    Back-end:
        - Sergio
        - Raul
        - Cristian

Dependencias: 
    db: Neon/PostgresDB
    front: ReactNative
    back: NestJS

    node.js 22xx
    



Estructura del proyecto: 
modulo-auth/
├── .git/                           # Git independiente del módulo
├── mobile/                         # React Native App
│   ├── src/
│   │   ├── submodules/
│   │   │   ├── login/              # Pareja 1
│   │   │   │   ├── screens/
│   │   │   │   ├── components/
│   │   │   │   └── services/
│   │   │   ├── signup/             # Pareja 2
│   │   │   │   ├── screens/
│   │   │   │   ├── components/
│   │   │   │   └── services/
│   │   │   └── password-reset/     # Pareja 3
│   │   │       ├── screens/
│   │   │       ├── components/
│   │   │       └── services/
│   │   ├── shared/
│   │   │   ├── types/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── constants/
│   │   └── navigation/
│   ├── package.json
│   └── app.json
│
├── backend/                        # NestJS API
│   ├── src/
│   │   ├── submodules/
│   │   │   ├── login/              # Pareja 1
│   │   │   │   ├── login.controller.ts
│   │   │   │   ├── login.service.ts
│   │   │   │   └── dto/
│   │   │   ├── signup/             # Pareja 2
│   │   │   │   ├── signup.controller.ts
│   │   │   │   ├── signup.service.ts
│   │   │   │   └── dto/
│   │   │   └── password-reset/     # Pareja 3
│   │   │       ├── password-reset.controller.ts
│   │   │       ├── password-reset.service.ts
│   │   │       └── dto/
│   │   ├── shared/
│   │   │   ├── database/
│   │   │   ├── guards/
│   │   │   └── decorators/
│   │   └── app.module.ts
│   ├── Dockerfile
│   └── package.json
│
├── database/                       # Neon Database Scripts
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_sessions.sql
│   │   └── 003_create_password_resets.sql
│   ├── seeds/
│   └── schema.sql
│
├── shared/                         # Tipos compartidos entre mobile y backend
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   └── validators/
│       ├── login.validator.ts
│       ├── signup.validator.ts
│       └── password.validator.ts
│
├── docker-compose.yml              # Solo para backend + database
├── .env.example
└── README.md
