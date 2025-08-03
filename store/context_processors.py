from .models import Cart

def cart_context(request):
    """Add cart information to all templates"""
    cart_total = 0
    if request.user.is_authenticated:
        try:
            cart = Cart.objects.get(user=request.user)
            cart_total = cart.get_total_items()
        except Cart.DoesNotExist:
            cart_total = 0
    
    return {
        'cart_total': cart_total
    }