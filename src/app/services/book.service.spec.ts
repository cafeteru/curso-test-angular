import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Book } from '../models/book.model';
import { BookService } from './book.service';

const listBookMock: Book[] = [
    {
        author: '1',
        isbn: '1',
        name: '1',
        price: 15,
        amount: 2,
        id: '1'
    },
    {
        author: '2',
        isbn: '2',
        name: '2',
        price: 20,
        amount: 1,
        id: '2'
    },
    {
        author: '3',
        isbn: '3',
        name: '3',
        price: 8,
        amount: 7,
        id: '3'
    }
];

describe('BookService', () => {
    let service: BookService;
    // Para crear el mock de las peticiones HTTP
    let httpMock: HttpTestingController;
    // Para crear mock del localstorage
    let storage = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BookService
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
            ]
        });
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
        spyOn(localStorage, 'getItem').and.callFake(
            (key) => storage[key] ? storage[key] : null
        );
        spyOn(localStorage, 'setItem').and.callFake(
            (key, value) => storage[key] = value);
    });

    afterEach(() => {
        // para que no haya peticiones pendientes entre las ejecuciones de los test
        httpMock.verify();
        storage = {};
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getBooks return a list of books and does a get method', () => {
        service.getBooks().subscribe(
            (res) => {
                expect(res).toEqual(listBookMock);
            }
        );

        // Crea el mock de la petición
        const req = httpMock.expectOne(`${environment.API_REST_URL}/book`);
        expect(req.request.method).toBe('GET');
        req.flush(listBookMock);
    });

    it('getBooksFromCart return empty array when localStorage is empty', () => {
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

    it('AddBookToCart add a book successfully when the list doesn\'t exist in the localStorage', () => {
        const toast = {
            fire: () => null
        };
        spyOn(Swal, 'mixin').and.callFake(() => toast as any);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(listBookMock[0]);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
    });

    it('AddBookToCart add a book successfully when the list exist in the localStorage', () => {
        const toast = {
            fire: () => null
        };
        spyOn(Swal, 'mixin').and.callFake(() => toast as any);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(listBookMock[0]);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.addBookToCart(listBookMock[1]);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(2);
    });

    it('AddBookToCart add a existed book successfully when the list exist in the localStorage', () => {
        // Objeto Mock
        const toast = {
            fire: () => null
        };
        spyOn(Swal, 'mixin').and.callFake(() => toast as any);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(listBookMock[0]);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.addBookToCart(listBookMock[0]);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        expect(listBook[0].amount).toBe(2);
    });

    it('removeBooksFromCart removes the list from the localStorage', () => {
        service.addBookToCart(listBookMock[0]);
        service.removeBooksFromCart();
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });
});
