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

### Sample Products

#### Smartphones
- **iPhone 15 Pro** - $999.99
  - Latest A17 Pro chip, 48MP camera system, titanium design
- **Samsung Galaxy S24 Ultra** - $1199.99
  - 200MP camera, S Pen included, 6.8" Dynamic AMOLED display
- **Google Pixel 8** - $699.99
  - Advanced AI photography, pure Android experience

#### Laptops
- **MacBook Air M3** - $1299.99
  - Apple M3 chip, 13.6" Liquid Retina display, all-day battery
- **Dell XPS 13** - $999.99
  - Intel Core i7, 13.4" InfinityEdge display, premium build
- **Gaming Laptop ASUS ROG** - $1499.99
  - NVIDIA RTX 4060, AMD Ryzen 7, 144Hz display

#### Audio
- **Sony WH-1000XM5** - $399.99
  - Industry-leading noise cancellation, 30-hour battery
- **AirPods Pro (2nd Gen)** - $249.99
  - Active noise cancellation, spatial audio, MagSafe charging
- **JBL Charge 5** - $179.99
  - Portable Bluetooth speaker, IP67 waterproof, 20-hour playtime

## Project Structure

```
ecommerce_site/
├── manage.py
├── requirements.txt
├── README.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_GUIDE.md
├── ecommerce_site/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── store/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── forms.py
│   └── migrations/
├── templates/
│   ├── base.html
│   ├── store/
│   │   ├── index.html
│   │   ├── product_list.html
│   │   ├── product_detail.html
│   │   ├── cart.html
│   │   └── checkout.html
│   └── registration/
│       ├── login.html
│       └── register.html
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── media/
    └── products/
```

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

## Admin Interface

Access the admin interface at `http://127.0.0.1:8000/admin/` with your superuser credentials.

### Admin Features:
- Add/edit/delete products
- Manage categories
- View and update orders
- User management
- Review moderation

## API Endpoints

### Public Pages
- `/` - Home page with featured products
- `/products/` - Product listing with search and filters
- `/products/<slug>/` - Individual product details

### User Account
- `/accounts/register/` - User registration
- `/accounts/login/` - User login
- `/accounts/logout/` - User logout

### Shopping
- `/cart/` - Shopping cart view
- `/cart/add/<product_id>/` - Add product to cart
- `/checkout/` - Checkout process

## Customization

### Styling
- Edit `static/css/style.css` for custom styling
- Colors are defined in CSS variables for easy theming
- Bootstrap classes can be overridden

### Adding Products
1. Use Django admin interface
2. Add product images to `media/products/`
3. Set appropriate categories and pricing

### Email Configuration
For production, configure email settings in `settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'your-smtp-server.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@example.com'
EMAIL_HOST_PASSWORD = 'your-password'
```

## Deployment

### Production Checklist
1. Set `DEBUG = False` in settings
2. Configure allowed hosts
3. Set up PostgreSQL database
4. Configure static file serving
5. Set up email backend
6. Configure security settings

### Environment Variables
Create a `.env` file for sensitive settings:
```
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the documentation in `ARCHITECTURE.md` and `IMPLEMENTATION_GUIDE.md`
- Review the code comments for implementation details
- Test the functionality using the provided sample data

## Screenshots

### Home Page
- Featured products grid
- Category navigation
- Search functionality

### Product Detail
- Product images and descriptions
- Add to cart and wishlist buttons
- Customer reviews and ratings

### Shopping Cart
- Item management (add/remove/update)
- Price calculations
- Checkout button

### User Dashboard
- Order history
- Profile management
- Wishlist view

---

**ElectroStore** - Your one-stop shop for electronics and gadgets! 🛒⚡