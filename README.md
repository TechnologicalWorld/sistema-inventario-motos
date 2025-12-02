# Sistema de Inventario y Ventas de Motos

## 📋 Descripción

Sistema web para gestionar inventario y ventas en una distribuidora de motos. Cuenta con roles de Propietario, gerente y empleado con funcionalidades específicas.

---

## 🏗️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Laravel 11.x, PHP 8.2+, MySQL 8.0+ |
| **Frontend** | Vue 3, TypeScript, Tailwind CSS |
| **API** | RESTful con JWT |
| **Build** | Vite |

---

## 🚀 Instalación Rápida

### Backend
```bash
cd backend
cp .env.example .env
composer install

php artisan migrate:fresh --seed

php artisan serve
# Si se lo necesita (Opcional) 
php artisan key:generate
php artisan jwt:secret
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🔌 Endpoints Principales

### Autenticación
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```


## 📁 Estructura

```
sistema-inventario-motos/
├── backend/
│   ├── app/Http/Controllers/
│   ├── app/Models/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/
│   ├── src/pages/
│   ├── src/services/
│   └── src/components/
└── README.md
```

---

## ⚙️ Variables de Entorno

### Backend (.env)
```env
APP_NAME="Sistema Inventario Motos"
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_DATABASE=inventario_motos
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=tu_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Sistema Inventario Motos"
```

---

## 🔐 Autenticación

Sistema con **JWT**. Flujo:
1. Usuario hace login → Backend emite token
2. Frontend almacena en localStorage
3. Cada petición incluye `Authorization: Bearer <token>`

---

## 🛠️ Scripts

### Backend
```bash
php artisan migrate          # Migrar BD
php artisan db:seed          # Datos de prueba
#  Opcional cuando se lo necesite
php artisan test             # Ejecutar tests
npm run build                # Build producción
```

### Frontend
```bash
npm run dev                  # Desarrollo
#  Opcional cuando se lo necesite
npm run build                # Build producción
npm run lint                 # Linting
```

---

## 📦 Requisitos

- Node.js 18+
- PHP 8.2+
- Composer
- MySQL 8.0+


---

## 📄 Licencia

Propiedad de World Tech

**Versión**: 1.0.0 | **Actualizado**: Enero 2025