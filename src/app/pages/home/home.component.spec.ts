import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { HomeComponent } from './home.component';

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

// Mock del servicio
const bookServiceMock = {
    getBooks: () => of(listBook),
};

// Mock del pipe
@Pipe({ name: 'reduceText' })
class ReduceTextPipeMock implements PipeTransform {
    transform(): string {
        return '';
    }
}

// fdescribe: para ejecutar solo esta clase de pruebas
// xdescribe: para saltar esta clase de pruebas
describe('Home component', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    // beforeAll se ejecuta antes de todos los test una vez
    // afterEach se ejecuta después de cada test
    // afterAll se ejecuta después de todos los test una vez

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [
                HomeComponent,
                ReduceTextPipeMock
            ],
            providers: [
                // Crea un mock del servicio en vez de usar el original
                {
                    provide: BookService,
                    useValue: bookServiceMock
                }
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check getBook() get books from the subscription', () => {
        const bookService = fixture.debugElement.injector.get(BookService);
        const list: Book[] = [];
        const spy = spyOn(bookService, 'getBooks').and.callFake(() => of(list));
        component.getBooks();
        expect(spy).toHaveBeenCalled();
        expect(component.listBook.length).toBe(list.length);
    });

    // fit: se usa para lanzar solo un test
    // xit: para saltar un test
    it('check getBook() get books from the subscription without spy', () => {
        component.getBooks();
        expect(component.listBook.length).toBe(listBook.length);
    });
});
