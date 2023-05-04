  import { HttpClient } from '@angular/common/http';
  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { Cart, CartItem } from 'src/app/models/cart.model';
  import { CartService } from 'src/app/services/cart.service';
  import { loadStripe } from '@stripe/stripe-js';
  import { Subscription } from 'rxjs';
  
  @Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
  })
  export class CartComponent implements OnInit, OnDestroy {
    cart: Cart = { items: [] };
    displayedColumns: string[] = [
      'product',
      'name',
      'price',
      'quantity',
      'total',
      'action',
    ];
    dataSource: CartItem[] = [];
    cartSubscription: Subscription | undefined;



  constructor(private cartService: CartService, private http: HttpClient) { }
  
  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<CartItem>) : number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http.post('https://webstorenodebackend.onrender.com/checkout', {
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51N3fgODs93hvqyjXpymq6cipA0YCUEJs7qy8f2Xl27o5h05LhKFJLamyCEUESW7hEYpAPvUAuufJzynldlbIVFqj00e89AUVVP');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

}
