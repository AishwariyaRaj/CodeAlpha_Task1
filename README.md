# ElectroStore - Electronics E-commerce Platform

A modern, full-featured e-commerce platform built with Django backend and responsive HTML/CSS/JavaScript frontend, specifically designed for electronics and gadgets with a clean blue/white theme.

## Features

### Core Functionality
- **Product Management**: Category-based organization with search and filtering
- **User Authentication**: Registration, login, logout with profile management
- **Shopping Cart**: Add/remove items, quantity updates, persistent cart
- **Order Processing**: Complete checkout flow with order tracking
- **Product Reviews**: 5-star rating system with user comments
- **Wishlist**: Save products for later purchase
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- Django admin interface for product management
- Order management and status updates
- User management
- Category and inventory management

## Technology Stack

- **Backend**: Django 4.x (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Styling**: Bootstrap 5 + Custom CSS
- **Authentication**: Django's built-in authentication system

## Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or create the project directory**
```bash
mkdir ecommerce_site
cd ecommerce_site
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv ecommerce_env
ecommerce_env\Scripts\activate

# Linux/Mac
python3 -m venv ecommerce_env
source ecommerce_env/bin/activate
```

3. **Install dependencies**
```bash
pip install django pillow
pip freeze > requirements.txt
```

4. **Create Django project and app**
```bash
django-admin startproject ecommerce_site .
python manage.py startapp store
```

5. **Configure settings** (Add to `ecommerce_site/settings.py`)
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'store',
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
```

6. **Set up URLs** (Update `ecommerce_site/urls.py`)
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

7. **Run migrations and create superuser**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

8. **Load sample data** (optional)
```bash
python manage.py loaddata sample_data.json
```

9. **Run the development server**
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to see your e-commerce site!

## Sample Electronics Data

### Categories
- Smartphones & Accessories
- Laptops & Computers
- Audio & Headphones
- Gaming & Consoles
- Smart Home & IoT
- Cameras & Photography
  
## Results

![Photo1](https://i.postimg.cc/CM7Cn4fD/photo1.png)

---

![Photo2](https://i.postimg.cc/s2fGrkwN/Screenshot-827.png)

---

![Photo3](https://i.postimg.cc/sx5gSmTW/Screenshot-828.png)

---

## Key Features Implementation

### 1. User Management
- User registration with email validation
- Login/logout functionality
- User profile with order history
- Password reset capability

### 2. Product Catalog
- Category-based product organization
- Product search and filtering
- Product image handling
- Stock management
- Product reviews and ratings

### 3. Shopping Experience
- Add to cart functionality
- Cart persistence across sessions
- Wishlist for saving products
- Responsive product browsing

### 4. Order Management
- Complete checkout process
- Order confirmation and tracking
- Order history for users
- Admin order management

### 5. Payment Simulation
- Basic payment form (no real payment processing)
- Order confirmation system
- Payment status tracking

### Admin Features:
- Add/edit/delete products
- Manage categories
- View and update orders
- User management
- Review moderation



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the documentation in `ARCHITECTURE.md` and `IMPLEMENTATION_GUIDE.md`
- Review the code comments for implementation details
- Test the functionality using the provided sample data

---

**ElectroStore** - Your one-stop shop for electronics and gadgets! 🛒⚡
