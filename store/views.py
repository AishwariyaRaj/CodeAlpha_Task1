from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q, Avg
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from decimal import Decimal
import json

from .models import Product, Category, Cart, CartItem, Order, OrderItem, Review, Wishlist, UserProfile
from .forms import ReviewForm, CheckoutForm, UserRegistrationForm, UserProfileForm

def home(request):
    """Home page with featured products"""
    featured_products = Product.objects.filter(is_active=True)[:8]
    categories = Category.objects.all()[:6]
    latest_products = Product.objects.filter(is_active=True).order_by('-created_at')[:4]
    
    context = {
        'featured_products': featured_products,
        'categories': categories,
        'latest_products': latest_products,
    }
    return render(request, 'store/index.html', context)

def product_list(request):
    """Product listing with search and filtering"""
    products = Product.objects.filter(is_active=True)
    categories = Category.objects.all()
    
    # Category filtering
    category_slug = request.GET.get('category')
    current_category = None
    if category_slug:
        current_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=current_category)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Price filtering
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)
    
    # Sorting
    sort_by = request.GET.get('sort', 'name')
    if sort_by == 'price_low':
        products = products.order_by('price')
    elif sort_by == 'price_high':
        products = products.order_by('-price')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    else:
        products = products.order_by('name')
    
    # Pagination
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'current_category': current_category,
        'search_query': search_query,
        'sort_by': sort_by,
        'min_price': min_price,
        'max_price': max_price,
    }
    return render(request, 'store/product_list.html', context)

def product_detail(request, slug):
    """Product detail page with reviews"""
    product = get_object_or_404(Product, slug=slug, is_active=True)
    reviews = product.reviews.all().order_by('-created_at')
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    
    # Check if user has this product in wishlist
    in_wishlist = False
    user_has_reviewed = False
    if request.user.is_authenticated:
        in_wishlist = Wishlist.objects.filter(user=request.user, product=product).exists()
        user_has_reviewed = Review.objects.filter(user=request.user, product=product).exists()
    
    # Handle review form submission
    if request.method == 'POST' and request.user.is_authenticated:
        if not user_has_reviewed:
            form = ReviewForm(request.POST)
            if form.is_valid():
                review = form.save(commit=False)
                review.product = product
                review.user = request.user
                review.save()
                messages.success(request, 'Your review has been added!')
                return redirect('product_detail', slug=slug)
        else:
            messages.error(request, 'You have already reviewed this product.')
    else:
        form = ReviewForm()
    
    # Related products
    related_products = Product.objects.filter(
        category=product.category, 
        is_active=True
    ).exclude(id=product.id)[:4]
    
    context = {
        'product': product,
        'reviews': reviews,
        'avg_rating': avg_rating,
        'form': form,
        'in_wishlist': in_wishlist,
        'user_has_reviewed': user_has_reviewed,
        'related_products': related_products,
    }
    return render(request, 'store/product_detail.html', context)

@login_required
def add_to_cart(request, product_id):
    """Add product to cart"""
    product = get_object_or_404(Product, id=product_id)
    
    if not product.is_in_stock():
        messages.error(request, 'This product is out of stock.')
        return redirect('product_detail', slug=product.slug)
    
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, 
        product=product,
        defaults={'quantity': 1}
    )
    
    if not created:
        if cart_item.quantity < product.stock_quantity:
            cart_item.quantity += 1
            cart_item.save()
        else:
            messages.error(request, 'Cannot add more items. Stock limit reached.')
            return redirect('product_detail', slug=product.slug)
    
    # AJAX response
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'cart_total': cart.get_total_items(),
            'message': f'{product.name} added to cart!'
        })
    
    messages.success(request, f'{product.name} added to cart!')
    return redirect('product_detail', slug=product.slug)

@login_required
def cart_view(request):
    """Shopping cart view"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    return render(request, 'store/cart.html', {'cart': cart})

@login_required
@require_POST
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    
    try:
        data = json.loads(request.body)
        quantity = int(data.get('quantity', 1))
        
        if quantity <= 0:
            cart_item.delete()
            return JsonResponse({'success': True, 'message': 'Item removed from cart'})
        elif quantity <= cart_item.product.stock_quantity:
            cart_item.quantity = quantity
            cart_item.save()
            return JsonResponse({
                'success': True,
                'message': 'Cart updated',
                'item_total': float(cart_item.get_total_price()),
                'cart_total': float(cart_item.cart.get_total_price())
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Not enough stock available'
            })
    except (ValueError, json.JSONDecodeError):
        return JsonResponse({'success': False, 'message': 'Invalid data'})

@login_required
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    product_name = cart_item.product.name
    cart_item.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': f'{product_name} removed from cart'
        })
    
    messages.success(request, f'{product_name} removed from cart')
    return redirect('cart_view')

@login_required
def checkout(request):
    """Checkout process"""
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        messages.error(request, 'Your cart is empty!')
        return redirect('cart_view')
    
    if request.method == 'POST':
        form = CheckoutForm(request.POST, user=request.user)
        if form.is_valid():
            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=cart.get_total_price(),
                shipping_address=form.cleaned_data['shipping_address'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email'],
                phone=form.cleaned_data['phone']
            )
            
            # Create order items
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )
                
                # Update product stock
                product = cart_item.product
                product.stock_quantity -= cart_item.quantity
                product.save()
            
            # Clear cart
            cart.items.all().delete()
            
            messages.success(request, f'Order #{order.id} placed successfully!')
            return redirect('order_detail', order_id=order.id)
    else:
        form = CheckoutForm(user=request.user)
    
    return render(request, 'store/checkout.html', {
        'cart': cart,
        'form': form
    })

@login_required
def order_detail(request, order_id):
    """Order detail view"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'store/order_detail.html', {'order': order})

@login_required
def order_history(request):
    """User's order history"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    paginator = Paginator(orders, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'store/order_history.html', {'page_obj': page_obj})

@login_required
def add_to_wishlist(request, product_id):
    """Add product to wishlist"""
    product = get_object_or_404(Product, id=product_id)
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        product=product
    )
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if created:
            return JsonResponse({
                'success': True,
                'message': f'{product.name} added to wishlist!',
                'action': 'added'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Product already in wishlist',
                'action': 'exists'
            })
    
    if created:
        messages.success(request, f'{product.name} added to wishlist!')
    else:
        messages.info(request, 'Product already in wishlist')
    
    return redirect('product_detail', slug=product.slug)

@login_required
def remove_from_wishlist(request, product_id):
    """Remove product from wishlist"""
    product = get_object_or_404(Product, id=product_id)
    try:
        wishlist_item = Wishlist.objects.get(user=request.user, product=product)
        wishlist_item.delete()
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': f'{product.name} removed from wishlist!',
                'action': 'removed'
            })
        
        messages.success(request, f'{product.name} removed from wishlist!')
    except Wishlist.DoesNotExist:
        messages.error(request, 'Product not in wishlist')
    
    return redirect('wishlist_view')

@login_required
def wishlist_view(request):
    """User's wishlist"""
    wishlist_items = Wishlist.objects.filter(user=request.user).order_by('-added_at')
    return render(request, 'store/wishlist.html', {'wishlist_items': wishlist_items})

@login_required
def profile_view(request):
    """User profile view"""
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=profile, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile_view')
    else:
        form = UserProfileForm(instance=profile, user=request.user)
    
    return render(request, 'store/profile.html', {'form': form})

def register(request):
    """User registration"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to ElectroStore!')
            return redirect('home')
    else:
        form = UserRegistrationForm()
    
    return render(request, 'registration/register.html', {'form': form})

def search_products(request):
    """AJAX product search"""
    query = request.GET.get('q', '')
    if len(query) >= 2:
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            is_active=True
        )[:10]
        
        results = []
        for product in products:
            results.append({
                'id': product.id,
                'name': product.name,
                'price': str(product.price),
                'url': product.get_absolute_url(),
                'image': product.image.url if product.image else None
            })
        
        return JsonResponse({'results': results})
    
    return JsonResponse({'results': []})
