import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

import { CartComponent } from './cart.component';

const listBook: Book[] = [
    {
        author: '1',
        isbn: '1',
        name: '1',
        price: 15,
        amount: 2
    },
    {
        author: '2',
        isbn: '2',
        name: '2',
        price: 20,
        amount: 1
    },
    {
        author: '3',
        isbn: '3',
        name: '3',
        price: 8,
        amount: 7
    }
];

describe('CartComponent', () => {
    let component: CartComponent; // Componente a testear
    let fixture: ComponentFixture<CartComponent>; // Permite extraer los servicios que usa el componente
    let service: BookService;

    // Se ejecuta antes de cada test
    beforeEach(() => {
        // Contiene toda la configuración del test
        TestBed.configureTestingModule({
            // Componentes a probar
            declarations: [
                CartComponent
            ],
            imports: [
                // Para hacer mocks de peticiones
                HttpClientTestingModule
            ],
            // Servicios que usamos
            providers: [
                BookService
            ],
            // Para evitar problemas con los test
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    // Instancia el componente para realizar los tests
    beforeEach(() => {
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Para entrar en el ngOnInit del componente

        // Para obtener el servicio aunque sea privado
        service = fixture.debugElement.injector.get(BookService);
        // Mockeamos la llamada al servicio
        spyOn(service, 'getBooksFromCart').and.callFake(() => listBook);
    });

    // Comprobamos la creación del componente
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check getTotalPrice return an amount', () => {
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).not.toBeNull();
        expect(totalPrice).toBeGreaterThan(0);
    });

    it('check onInputNumberChange increments correctly', () => {
        const action = 'plus';
        // Creamos una copia para evitar problemas por el orden de ejecución de los test
        const book = Object.assign({}, listBook[0]);
        const amount = book.amount;
        // Observa el método del servicio
        const spyUpdateAmountBook = spyOn(service, 'updateAmountBook')
            // callFake: mockea la respuesta del método, es decir,
            // devuelve la función que indiquemos
            .and.callFake(() => []);
        const spyGetTotalPrice = spyOn(component, 'getTotalPrice').and.callFake(() => 0);
        component.onInputNumberChange(action, book);
        expect(spyUpdateAmountBook).toHaveBeenCalled();
        expect(spyGetTotalPrice).toHaveBeenCalled();
        expect(book.amount).toBe(amount + 1);
    });

    it('check onInputNumberChange decrements correctly', () => {
        const action = 'minus';
        const book = Object.assign({}, listBook[0]);
        const amount = book.amount;
        const spyUpdateAmountBook = spyOn(service, 'updateAmountBook').and.callFake(() => []);
        const spyGetTotalPrice = spyOn(component, 'getTotalPrice').and.callFake(() => 0);
        component.onInputNumberChange(action, book);
        expect(spyUpdateAmountBook).toHaveBeenCalled();
        expect(spyGetTotalPrice).toHaveBeenCalled();
        expect(book.amount).toBe(amount - 1);
    });

    it('check onClearBooks works correctly', () => {
        // Hay que realizar este casteo para poder acceder a
        // los métodos privados pero no es la mejor opción
        const spy = spyOn((component as any), '_clearListCartBook')
            // Se ejecuta de manera normal pero también se observa
            .and.callThrough();
        component.listCartBook = listBook;
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(spy).toHaveBeenCalled();
    });

    it('The title "The cart is empty" is not displayed when there is a list', () => {
        component.listCartBook = listBook;
        // Para forzar la actualización de la vista
        fixture.detectChanges();
        // Usamos By como en Selenium
        // query -> devuelve un element
        // queryAll -> devuelve un listado
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleEmpty'));
        expect(debugElement).toBeFalsy();
    });

    it('The title "The cart is empty" is displayed when there isn´t a list', () => {
        component.listCartBook = [];
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleEmpty'));
        expect(debugElement).toBeTruthy();
        // Comprobamos el texto del elemento HTML
        const element: HTMLElement = debugElement.nativeElement;
        expect(element.innerHTML).toContain('The cart is empty');
    });
});
