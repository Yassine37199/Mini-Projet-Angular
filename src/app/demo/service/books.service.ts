// Importation des modules requis
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from 'src/app/demo/api/Book';

@Injectable()
export class BooksService {
    // Constructeur de la classe BooksService, qui prend une instance de HttpClient comme paramètre
    constructor(private http: HttpClient) {}

    // Fonction pour récupérer la liste des livres
    getBooks() {
        // Utilise HttpClient pour effectuer une requête GET vers le fichier JSON contenant les données des livres
        // 'assets/demo/data/books.json' est le chemin du fichier JSON relatif à l'application
        return this.http
            .get<any>('assets/demo/data/books.json')
            .toPromise() // Convertit l'observable en une promesse
            .then((res) => res.data as Book[]) // Récupère la propriété 'data' de la réponse et la convertit en un tableau de livres de type 'Book[]'
            .then((data) => data); // Retourne les données des livres
    }
}
