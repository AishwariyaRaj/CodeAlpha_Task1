# ElectroStore - Complete Setup and Run Guide

## 🚀 Quick Start Commands

### 1. **Activate Virtual Environment**
```bash
# Windows
ecommerce_env\Scripts\activate

# Linux/Mac
source ecommerce_env/bin/activate
```

### 2. **Create Superuser (Admin Account)**
```bash
python manage.py createsuperuser
```
- Username: `admin`
- Email: `admin@electrostore.com`
- Password: `admin123` (or your preferred password)

### 3. **Run the Development Server**
```bash
python manage.py runserver
```

### 4. **Access the Application**
- **Main Website**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/

---

## 📋 Complete Setup Process

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Step-by-Step Setup

1. **Navigate to Project Directory**
   ```bash
   cd d:/ecommerce
   ```

2. **Activate Virtual Environment**
   ```bash
   ecommerce_env\Scripts\activate
   ```

3. **Verify Dependencies** (Already installed)
   ```bash
   pip list
   ```
   Should show: Django, Pillow, and other dependencies

4. **Check Database Status** (Already migrated)
   ```bash
   python manage.py showmigrations
   ```

5. **Create Superuser** (If not created yet)
   ```bash
   python manage.py createsuperuser
   ```

6. **Collect Static Files** (Optional for development)
   ```bash
   python manage.py collectstatic
   ```

7. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

---

## 🛍️ Adding Sample Data

### Method 1: Using Django Admin
1. Go to http://127.0.0.1:8000/admin/
2. Login with your superuser credentials
3. Add Categories:
   - Smartphones & Accessories
   - Laptops & Computers
   - Audio & Headphones
   - Gaming & Consoles
   - Smart Home & IoT
   - Cameras & Photography

4. Add Products with details from `SAMPLE_DATA.md`

### Method 2: Using Django Shell
```bash
python manage.py shell
```

Then run:
```python
from store.models import Category, Product
from decimal import Decimal

# Create categories
categories_data = [
    {'name': 'Smartphones & Accessories', 'description': 'Latest smartphones, cases, chargers, and mobile accessories'},
    {'name': 'Laptops & Computers', 'description': 'Laptops, desktops, monitors, and computer accessories'},
    {'name': 'Audio & Headphones', 'description': 'Headphones, speakers, earbuds, and audio equipment'},
    {'name': 'Gaming & Consoles', 'description': 'Gaming consoles, controllers, games, and gaming accessories'},
    {'name': 'Smart Home & IoT', 'description': 'Smart home devices, IoT gadgets, and home automation'},
    {'name': 'Cameras & Photography', 'description': 'Digital cameras, lenses, tripods, and photography equipment'},
]

for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults={'description': cat_data['description']}
    )
    if created:
        print(f'Created category: {category.name}')

# Create sample products
smartphones = Category.objects.get(name='Smartphones & Accessories')

products_data = [
    {
        'name': 'iPhone 15 Pro',
        'description': 'The iPhone 15 Pro features the powerful A17 Pro chip, a stunning 48MP camera system with advanced computational photography, and a beautiful titanium design. Experience pro-level performance with all-day battery life.',
        'price': Decimal('999.99'),
        'category': smartphones,
        'stock_quantity': 25
    },
    {
        'name': 'Samsung Galaxy S24 Ultra',
        'description': 'Samsung Galaxy S24 Ultra with 200MP camera, built-in S Pen, 6.8" Dynamic AMOLED 2X display, and Galaxy AI features. The ultimate Android flagship experience.',
        'price': Decimal('1199.99'),
        'category': smartphones,
        'stock_quantity': 18
    },
    {
        'name': 'Google Pixel 8',
        'description': 'Google Pixel 8 with advanced AI photography, Magic Eraser, pure Android experience, and 7 years of security updates. Capture life\'s moments with computational photography.',
        'price': Decimal('699.99'),
        'category': smartphones,
        'stock_quantity': 30
    }
]

for product_data in products_data:
    product, created = Product.objects.get_or_create(
        name=product_data['name'],
        defaults=product_data
    )
    if created:
        print(f'Created product: {product.name}')

print("Sample data created successfully!")
exit()
```

---

## 🌐 Application Features

### User Features
- **Home Page**: Featured products and categories
- **Product Browsing**: Search, filter, and sort products
- **User Registration/Login**: Account management
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save products for later
- **Product Reviews**: Rate and review products
- **Order Management**: Place orders and view history
- **User Profile**: Manage personal information

### Admin Features
- **Product Management**: Add, edit, delete products
- **Category Management**: Organize products
- **Order Management**: View and update order status
- **User Management**: Manage customer accounts
- **Review Moderation**: Manage product reviews

---

## 🔧 Development Commands

### Database Operations
```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (if needed)
python manage.py flush
```

### User Management
```bash
# Create superuser
python manage.py createsuperuser

# Change user password
python manage.py changepassword username
```

### Development Server
```bash
# Run server (default port 8000)
python manage.py runserver

# Run on specific port
python manage.py runserver 8080

# Run on all interfaces
python manage.py runserver 0.0.0.0:8000
```

### Static Files
```bash
# Collect static files
python manage.py collectstatic

# Find static files
python manage.py findstatic filename.css
```

---

## 📱 Testing the Application

### 1. **Home Page Test**
- Visit http://127.0.0.1:8000/
- Check hero section, categories, and featured products

### 2. **User Registration Test**
- Go to http://127.0.0.1:8000/register/
- Create a new user account
- Verify login functionality

### 3. **Product Management Test**
- Login to admin: http://127.0.0.1:8000/admin/
- Add categories and products
- Check product display on frontend

### 4. **Shopping Features Test**
- Browse products: http://127.0.0.1:8000/products/
- Add items to cart
- Test wishlist functionality
- Place a test order

---

## 🐛 Troubleshooting

### Common Issues

1. **Virtual Environment Not Activated**
   ```bash
   # Make sure you see (ecommerce_env) in your terminal
   ecommerce_env\Scripts\activate
   ```

2. **Module Not Found Error**
   ```bash
   # Reinstall dependencies
   pip install django pillow
   ```

3. **Database Issues**
   ```bash
   # Reset migrations
   python manage.py migrate --run-syncdb
   ```

4. **Static Files Not Loading**
   ```bash
   # Collect static files
   python manage.py collectstatic --noinput
   ```

5. **Port Already in Use**
   ```bash
   # Use different port
   python manage.py runserver 8080
   ```

---

## 📊 Project Structure

```
ecommerce_site/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── db.sqlite3               # SQLite database
├── ecommerce_site/          # Main project settings
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py              # WSGI configuration
├── store/                   # Main application
│   ├── models.py            # Database models
│   ├── views.py             # View functions
│   ├── urls.py              # App URL patterns
│   ├── forms.py             # Django forms
│   ├── admin.py             # Admin configuration
│   └── migrations/          # Database migrations
├── templates/               # HTML templates
│   ├── base.html            # Base template
│   ├── store/               # Store templates
│   └── registration/        # Auth templates
├── static/                  # Static files
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── images/              # Images
└── media/                   # User uploaded files
    └── products/            # Product images
```

---

## 🎯 Next Steps

1. **Add More Products**: Use the admin panel to add more electronics
2. **Customize Styling**: Modify `static/css/style.css` for custom themes
3. **Add Payment Integration**: Implement real payment processing
4. **Deploy to Production**: Use services like Heroku, DigitalOcean, or AWS
5. **Add Email Functionality**: Configure email for order confirmations
6. **Implement Search**: Enhance search with Elasticsearch or similar
7. **Add Analytics**: Integrate Google Analytics or similar tools

---

## 📞 Support

For issues or questions:
1. Check the `ARCHITECTURE.md` for system design details
2. Review `IMPLEMENTATION_GUIDE.md` for code explanations
3. Check `SAMPLE_DATA.md` for data examples
4. Review Django documentation: https://docs.djangoproject.com/

---

**🎉 Your ElectroStore e-commerce platform is ready to use!**

Start the server with `python manage.py runserver` and visit http://127.0.0.1:8000/