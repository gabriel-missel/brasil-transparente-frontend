import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private federalEntityNameSubject = new BehaviorSubject<string>('União Federal');
  private federalEntityImageSubject = new BehaviorSubject<string>('/images/estados/uniao.png');
  private federalEntityIdSubject = new BehaviorSubject<string>('1');

  federalEntityName$ = this.federalEntityNameSubject.asObservable();
  federalEntityImage$ = this.federalEntityImageSubject.asObservable();
  federalEntityId$ = this.federalEntityIdSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const name = localStorage.getItem('federalEntityName');
    const image = localStorage.getItem('federalEntityImage');
    const id = localStorage.getItem('federalEntityId');

    //TODO simplificar
    if (name) this.federalEntityNameSubject.next(name);
    if (image) this.federalEntityImageSubject.next(image);
    if (id) this.federalEntityIdSubject.next(id);
  }

  setFederalEntity(name: string, image: string, id: string): void {
    localStorage.setItem('federalEntityName', name);
    localStorage.setItem('federalEntityImage', image);
    localStorage.setItem('federalEntityId', id);
    
    this.federalEntityNameSubject.next(name);
    this.federalEntityImageSubject.next(image);
    this.federalEntityIdSubject.next(id);
  }

  get federalEntityName(): string {
    return this.federalEntityNameSubject.value;
  }

  get federalEntityImage(): string {
    return this.federalEntityImageSubject.value;
  }

  get federalEntityId(): string {
    return this.federalEntityIdSubject.value;
  }
}