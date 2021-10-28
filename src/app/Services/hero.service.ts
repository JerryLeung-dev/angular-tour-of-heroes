import { Injectable } from '@angular/core';
import { Hero } from '../hero.model';
import { Observable, of } from 'rxjs';
import { HEROES } from '../mock-heroes';
import { MessageServiceService } from './message-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  constructor(
    private http: HttpClient,
    private messageService: MessageServiceService
  ) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getHeroes(): Observable<Hero[]> {
    this.log(`fetched heros`);
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => console.log('fetched hero')),
      catchError(this.handleError<Hero>(`getHero id =$id`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    // The heroes web API expects a special header in HTTP save requests.
    //That header is in the httpOptions constant defined in the HeroService
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => console.log('updated hero id=${hero.id}')),
      catchError(this.handleError<any>(`updateHero`))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    // It expects the server to generate an id for the new hero,
    //which it returns in the Observable<Hero> to the caller.
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  private log(message: string) {
    this.messageService.add(`HeroService:${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      //if not search term, return empty hero array
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
