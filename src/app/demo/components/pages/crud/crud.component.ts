// Importation des modules et des services requis
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/demo/api/Book';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BooksService } from 'src/app/demo/service/books.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
})
export class CrudComponent implements OnInit {
    // Déclaration des variables du composant
    bookDialog: boolean = false;
    deleteBookDialog: boolean = false;
    deleteBooksDialog: boolean = false;
    books: Book[] = [];
    book: Book = {};
    selectedBooks: Book[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private bookservice: BooksService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Cette fonction est appelée lors de l'initialisation du composant
        // Récupère les livres à partir du service et les assigne à l'array 'books'
        this.bookservice.getBooks().then((data) => {
            this.books = data;
            console.log(this.books);
        });

        // Définit les en-têtes de colonnes pour le tableau
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'intitule', header: 'Intitulé' },
            { field: 'auteur', header: 'Auteur' },
            { field: 'editeur', header: 'Editeur' },
            { field: 'published_date', header: 'Année de publication' },
        ];
    }

    // Fonction pour ouvrir la boîte de dialogue pour ajouter un nouveau livre
    openNew() {
        this.book = {};
        this.submitted = false;
        this.bookDialog = true;
    }

    // Fonction pour ouvrir la boîte de dialogue pour supprimer des livres sélectionnés
    deleteSelectedBooks() {
        this.deleteBooksDialog = true;
    }

    // Fonction pour ouvrir la boîte de dialogue pour éditer un livre
    editBook(book: Book) {
        this.book = { ...book };
        this.bookDialog = true;
    }

    // Fonction pour ouvrir la boîte de dialogue pour supprimer un livre
    deleteBook(book: Book) {
        this.deleteBookDialog = true;
        this.book = { ...book };
    }

    // Fonction pour confirmer la suppression des livres sélectionnés
    confirmDeleteSelected() {
        this.deleteBooksDialog = false;
        // Supprime les livres sélectionnés de l'array 'books'
        this.books = this.books.filter(
            (val) => !this.selectedBooks.includes(val)
        );
        // Affiche un message de succès en utilisant le MessageService
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Livres supprimés',
            life: 3000,
        });
        this.selectedBooks = [];
    }

    // Fonction pour confirmer la suppression d'un livre
    confirmDelete() {
        this.deleteBookDialog = false;
        // Supprime le livre avec l'ID spécifié de l'array 'books'
        this.books = this.books.filter((val) => val.id !== this.book.id);
        // Affiche un message de succès en utilisant le MessageService
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Livre supprimé',
            life: 3000,
        });
        this.book = {};
    }

    // Fonction pour masquer la boîte de dialogue d'ajout/édition d'un livre
    hideDialog() {
        this.bookDialog = false;
        this.submitted = false;
    }

    // Fonction pour enregistrer un livre (ajouter ou mettre à jour) dans l'array 'books'
    saveBook() {
        this.submitted = true;
        console.log(this.book);
        if (this.book.intitule?.trim()) {
            if (this.book.id) {
                // Met à jour le livre existant s'il a une propriété 'id'
                this.books[this.findIndexById(this.book.id)] = this.book;
                // Affiche un message de succès en utilisant le MessageService
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Livre mis à jour',
                    life: 3000,
                });
            } else {
                // Génère un 'id' aléatoire pour un nouveau livre et l'ajoute à l'array 'books'
                this.book.id = this.createId();
                this.books.push(this.book);
                // Affiche un message de succès en utilisant le MessageService
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Livre créé',
                    life: 3000,
                });
            }
            this.books = [...this.books];
            this.bookDialog = false;
            this.book = {};
        }
    }

    // Fonction pour trouver l'index d'un livre dans l'array 'books' en fonction de son 'id'
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    // Fonction pour créer un 'id' aléatoire pour un nouveau livre
    createId(): string {
        const prefix = '978';
        const randomNumber = Math.floor(Math.random() * 10000000000);
        const bookId =
            prefix + randomNumber.toString().padStart(10 - prefix.length, '0');
        return bookId;
    }

    // Fonction pour appliquer un filtre global au tableau
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
