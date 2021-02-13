import { Injectable,EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

 public myEvent=new EventEmitter
  constructor() { }
}
