import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public listCartBook: Book[] = [];
  public totalPrice = 0;
  public Math = Math;

  constructor(
    private readonly _bookService: BookService
  ) { }

  ngOnInit(): void {
    this.listCartBook = this._bookService.getBooksFromCart();
    this.totalPrice = this.getTotalPrice(this.listCartBook);
  }

  public getTotalPrice(listCartBook: Book[]): number {
    let totalPrice = 0;
    listCartBook.forEach((book) => {
      totalPrice += book.amount * book.price;
    });
    return totalPrice;
  }

  public onInputNumberChange(action: string, book: Book): void {
    const amount = action === 'plus' ? book.amount + 1 : book.amount - 1;
    book.amount = Number(amount);
    this.listCartBook = this._bookService.updateAmountBook(book);
    this.totalPrice = this.getTotalPrice(this.listCartBook);
  }

  public onClearBooks(): void {
    if (this.listCartBook && this.listCartBook.length > 0) {
      this._clearListCartBook();
    } else {
      console.log("No books available");
    }
  }

  private _clearListCartBook() {
    this.listCartBook = [];
    this._bookService.removeBooksFromCart();
  }


}
